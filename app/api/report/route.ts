export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { MOCK_BUSINESS, MOCK_GRANTS, MOCK_ITEMS } from "@/lib/mock";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({
        business: MOCK_BUSINESS,
        generated_at: new Date().toISOString(),
        overall_score: 72,
        penalty_exposure: 72000,
        items: MOCK_ITEMS,
        grants: MOCK_GRANTS,
      });
    }

    const businessId = req.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error: bErr } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (bErr || !business) {
      return NextResponse.json({ error: bErr?.message ?? "Business not found" }, { status: 404 });
    }

    const { data: items, error: iErr } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("business_id", businessId)
      .order("deadline", { ascending: true });

    if (iErr) {
      return NextResponse.json({ error: iErr.message }, { status: 500 });
    }

    const { data: grants } = await supabase
      .from("grant_matches")
      .select("*")
      .eq("business_id", businessId)
      .order("eligibility_pct", { ascending: false });

    const penaltyExposure = (items ?? []).filter((it) => (it.risk_score ?? 0) >= 80).reduce((sum, it) => sum + (it.penalty_rm_min ?? 0), 0);

    return NextResponse.json({
      business,
      generated_at: new Date().toISOString(),
      overall_score: Math.round(((items ?? []).reduce((sum, it) => sum + (it.risk_score ?? 0), 0) || 0) / Math.max((items ?? []).length, 1)),
      penalty_exposure: penaltyExposure,
      items: items ?? [],
      grants: grants ?? [],
    });
  } catch (error) {
    console.error("/api/report failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}