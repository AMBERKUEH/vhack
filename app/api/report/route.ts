export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildRiskData, type ComplianceItem, type ItemStatus, type Priority } from "@/lib/risk";

type ReportPayload = ReturnType<typeof buildRiskData> & {
  business: {
    id: string;
    name: string;
    type?: string;
    location?: string;
  };
  grants: Array<{
    grant_name: string;
    grant_body: string;
    value_rm: number;
    eligibility_pct: number;
  }>;
  generated_at: string;
};

type DbReportItemRow = {
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
  documents?: Array<{ expiry_date: string | null; uploaded_at: string | null }> | null;
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

function mapDbItems(items: DbReportItemRow[]): ComplianceItem[] {
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
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const [businessRes, itemsRes, grantsRes] = await Promise.all([
      supabase.from("businesses").select("*").eq("id", businessId).single(),
      supabase.from("compliance_items").select("*, documents(expiry_date, uploaded_at)").eq("business_id", businessId),
      supabase.from("grant_matches").select("*").eq("business_id", businessId).order("eligibility_pct", { ascending: false }),
    ]);

    if (businessRes.error || !businessRes.data) {
      return NextResponse.json({ error: businessRes.error?.message ?? "Business not found" }, { status: 404 });
    }

    const mappedItems = mapDbItems((itemsRes.data ?? []) as DbReportItemRow[]);
    const riskData = buildRiskData(mappedItems);

    return NextResponse.json({
      business: businessRes.data as ReportPayload["business"],
      ...riskData,
      grants: (grantsRes.data ?? []) as ReportPayload["grants"],
      generated_at: new Date().toISOString(),
    } satisfies ReportPayload);
  } catch (error) {
    console.error("Report API error:", error);
    return NextResponse.json({ error: "Failed to load report data" }, { status: 500 });
  }
}
