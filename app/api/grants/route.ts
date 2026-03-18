export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { MOCK_GRANTS } from "@/lib/mock";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({ grants: MOCK_GRANTS });
    }

    const businessId = req.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("grant_matches")
      .select("*")
      .eq("business_id", businessId)
      .order("eligibility_pct", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ grants: data ?? [] });
  } catch (error) {
    console.error("/api/grants failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}