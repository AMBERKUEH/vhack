export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildRiskData, getItemRisk, getOverallScore, type ComplianceItem, type ItemStatus, type Priority } from "@/lib/risk";

type RiskApiPayload = ReturnType<typeof buildRiskData>;

type DbRiskItemRow = {
  id: string;
  business_id: string;
  name: string;
  authority: string | null;
  deadline: string | null;
  renewal_cycle: string | null;
  status: string | null;
  risk_score: number | null;
  priority: string | null;
  penalty_rm_min: number | null;
  penalty_rm_max: number | null;
  notes: string | null;
  documents?: Array<{ id: string; expiry_date: string | null; uploaded_at: string | null }> | null;
};

const MOCK_RISK: RiskApiPayload = {
  overall_score: 72,
  risk_level: "HIGH",
  penalty_exposure: 72000,
  items_at_risk: 4,
  next_deadline: {
    name: "Premises Business Licence",
    days_away: 45,
    deadline: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
  },
  items: [],
  forecast: [],
};

function toPriority(value: string | null): Priority {
  if (value === "CRITICAL" || value === "HIGH" || value === "MEDIUM" || value === "GRANT") return value;
  return "HIGH";
}

function toItemStatus(value: string | null): ItemStatus {
  if (value === "compliant" || value === "uploaded" || value === "pending" || value === "expiring" || value === "expired" || value === "missing") {
    return value;
  }
  return "pending";
}

function mapDbRows(items: DbRiskItemRow[]): ComplianceItem[] {
  return items.map((item) => {
    const docs = item.documents ?? [];
    return {
      id: item.id,
      business_id: item.business_id,
      name: item.name,
      authority: item.authority ?? "Unknown",
      deadline: item.deadline,
      renewal_cycle: item.renewal_cycle ?? "annual",
      status: toItemStatus(item.status),
      risk_score: item.risk_score ?? 100,
      priority: toPriority(item.priority),
      penalty_rm_min: item.penalty_rm_min ?? 0,
      penalty_rm_max: item.penalty_rm_max ?? 0,
      notes: item.notes ?? undefined,
      document_uploaded: docs.length > 0,
      expiry_date: docs[0]?.expiry_date ?? null,
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    const SIM = process.env.SIMULATION_MODE === "true";
    if (SIM) return NextResponse.json(MOCK_RISK);

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(MOCK_RISK);
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: items, error } = await supabase
      .from("compliance_items")
      .select(
        `
        *,
        documents (
          id,
          expiry_date,
          uploaded_at
        )
      `,
      )
      .eq("business_id", businessId)
      .order("priority", { ascending: true });

    if (error) throw error;
    if (!items || items.length === 0) return NextResponse.json(MOCK_RISK);

    const mappedItems = mapDbRows(items as DbRiskItemRow[]);

    const scoredItems: ComplianceItem[] = mappedItems.map((item) => ({
      ...item,
      risk_score: getItemRisk(item),
    }));

    await Promise.all(
      scoredItems.map((item) => supabase.from("compliance_items").update({ risk_score: item.risk_score }).eq("id", item.id)),
    );

    const previousScore = getOverallScore(mappedItems);
    const riskData = buildRiskData(scoredItems);

    if (Math.abs(riskData.overall_score - previousScore) >= 5) {
      await supabase.from("risk_events").insert({
        business_id: businessId,
        event_type: "score_recalculated",
        old_score: previousScore,
        new_score: riskData.overall_score,
        description: `Score changed from ${previousScore} to ${riskData.overall_score}`,
      });
    }

    return NextResponse.json(riskData);
  } catch (error) {
    console.error("Risk API error:", error);
    return NextResponse.json(MOCK_RISK);
  }
}