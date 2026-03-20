import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    const body = (await req.json()) as { businessId: string; email: string; language: "en" | "bm" };
    if (!body.businessId || !body.email || !body.language) {
      return NextResponse.json({ error: "businessId, email, language are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const upsert = await supabase.from("email_alerts").upsert(
      {
        business_id: body.businessId,
        email: body.email,
        language: body.language,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id" },
    );

    if (upsert.error) {
      return NextResponse.json({ error: upsert.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/alerts failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

