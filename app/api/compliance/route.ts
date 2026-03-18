export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { MOCK_ITEMS } from "@/lib/mock";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const itemId = req.nextUrl.searchParams.get("id");

    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({ items: itemId ? MOCK_ITEMS.filter((i) => i.id === itemId) : MOCK_ITEMS });
    }

    const businessId = req.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let query = supabase.from("compliance_items").select("*").eq("business_id", businessId);
    if (itemId) query = query.eq("id", itemId);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error("/api/compliance failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}