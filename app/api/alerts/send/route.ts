import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";
import { sendEmail } from "@/lib/mailer";

type SendBody = {
  businessId: string;
  test?: boolean;
};

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }
    const body = (await req.json()) as SendBody;
    if (!body.businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: alertRow, error: alertError } = await supabase
      .from("email_alerts")
      .select("*")
      .eq("business_id", body.businessId)
      .eq("active", true)
      .maybeSingle();
    if (alertError) {
      return NextResponse.json({ error: alertError.message }, { status: 500 });
    }
    if (!alertRow?.email) {
      return NextResponse.json({ error: "No active email alert for this business" }, { status: 404 });
    }

    if (body.test) {
      await sendEmail(
        alertRow.email,
        "Compliance Copilot Test Alert",
        "<p>This is a test email from Compliance Copilot.</p>",
      );
      return NextResponse.json({ success: true, sent: 1, test: true });
    }

    const { data: items, error: itemsError } = await supabase
      .from("compliance_items")
      .select("id, name, deadline")
      .eq("business_id", body.businessId)
      .not("deadline", "is", null);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    let sent = 0;
    for (const item of items ?? []) {
      const days = daysUntil(item.deadline);
      if (!days || ![90, 30, 7].includes(days)) continue;

      const key = `${item.id}:${days}:${item.deadline}`;
      const existing = await supabase
        .from("alert_logs")
        .select("id")
        .eq("business_id", body.businessId)
        .eq("log_key", key)
        .limit(1);
      if (existing.data && existing.data.length > 0) continue;

      const subject = `Compliance deadline in ${days} days`;
      const html = `<p>Reminder: <strong>${item.name}</strong> deadline is in <strong>${days}</strong> days.</p>`;
      await sendEmail(alertRow.email, subject, html);

      await supabase.from("alert_logs").insert({
        business_id: body.businessId,
        compliance_item_id: item.id,
        channel: "email",
        threshold_days: days,
        sent_to: alertRow.email,
        log_key: key,
      });
      sent += 1;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("/api/alerts/send failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send alerts" }, { status: 500 });
  }
}

