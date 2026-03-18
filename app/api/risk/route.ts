export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { getForecast, getItemRisk, getOverallScore, getPenaltyExposure } from "@/lib/risk";
import type { ComplianceItem } from "@/lib/types";
import { mockRiskPayload } from "@/lib/mock";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json(mockRiskPayload());
    }

    const businessId = req.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: items, error: itemsError } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("business_id", businessId);

    if (itemsError || !items) {
      return NextResponse.json({ error: itemsError?.message ?? "Unable to load items" }, { status: 500 });
    }

    const { data: documents } = await supabase
      .from("documents")
      .select("compliance_item_id,expiry_date")
      .eq("business_id", businessId);

    const docMap = new Map<string, string | null>();
    (documents ?? []).forEach((doc) => {
      if (doc.compliance_item_id) docMap.set(doc.compliance_item_id, doc.expiry_date ?? null);
    });

    const computed = (items as ComplianceItem[]).map((item) => {
      const expiry = docMap.get(item.id) ?? null;
      const risk = getItemRisk({ document_uploaded: docMap.has(item.id), expiry_date: expiry });
      return { ...item, risk_score: risk, document_uploaded: docMap.has(item.id), expiry_date: expiry };
    });

    const overall = getOverallScore(computed);
    const penaltyExposure = getPenaltyExposure(computed);
    const forecast = getForecast(computed);

    return NextResponse.json({ overall_score: overall, penalty_exposure: penaltyExposure, items: computed, forecast });
  } catch (error) {
    console.error("/api/risk failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}