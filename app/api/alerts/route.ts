import { NextResponse } from "next/server";
import { scheduleDeadlineAlerts } from "@/lib/whatsapp";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";

export async function GET(): Promise<NextResponse> {
  try {
    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({ success: true, alerts_scheduled: 3 });
    }

    const supabase = getSupabaseAdmin();
    const { data: businesses, error } = await supabase.from("businesses").select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let total = 0;
    for (const business of businesses ?? []) {
      total += await scheduleDeadlineAlerts(String(business.id));
    }

    return NextResponse.json({ success: true, alerts_scheduled: total });
  } catch (error) {
    console.error("/api/alerts GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { businessId: string; phone: string; language: "en" | "bm" };

    if (!body.businessId || !body.phone || !body.language) {
      return NextResponse.json({ error: "businessId, phone, language are required" }, { status: 400 });
    }

    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({ success: true, alerts_scheduled: 3 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("businesses").update({ phone: body.phone, language_pref: body.language }).eq("id", body.businessId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const scheduled = await scheduleDeadlineAlerts(body.businessId);
    return NextResponse.json({ success: true, alerts_scheduled: scheduled });
  } catch (error) {
    console.error("/api/alerts failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}