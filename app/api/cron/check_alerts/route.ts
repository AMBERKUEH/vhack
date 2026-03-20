// app/api/alerts/check/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/mailer";

const THRESHOLDS = [90, 30, 7];

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function getActiveThreshold(days: number): number | null {
  if (days < 0) return null;
  if (days <= 7) return 7;
  if (days <= 30) return 30;
  if (days <= 90) return 90;
  return null;
}

export async function POST(req: Request) {
  try {
    const { businessId } = await req.json();
    if (!businessId) return NextResponse.json({ error: "businessId required" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    // Get alert preference for this business only
    const { data: alertRow } = await supabase
      .from("email_alerts")
      .select("email, language")
      .eq("business_id", businessId)
      .eq("active", true)
      .maybeSingle();

    if (!alertRow?.email) return NextResponse.json({ sent: 0 }); // no alert set up

    // Get compliance items
    const { data: items } = await supabase
      .from("compliance_items")
      .select("id, name, deadline")
      .eq("business_id", businessId)
      .not("deadline", "is", null);

    let sent = 0;

    for (const item of items ?? []) {
      const days = daysUntil(item.deadline);
      const threshold = getActiveThreshold(days);
      if (threshold === null) continue;

      const logKey = `${item.id}:${threshold}:${item.deadline}`;

      const { data: existing } = await supabase
        .from("alert_logs")
        .select("id")
        .eq("log_key", logKey)
        .limit(1);

      if (existing?.length) continue; // already sent

      const subject = `[Compliance Copilot] ${item.name} — ${days} days to deadline`;
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0a0a0a;color:#f0f0f0;border-radius:8px">
          <h2 style="color:#f59e0b">⚠️ Compliance Deadline Reminder</h2>
          <p>Your <strong>${item.name}</strong> deadline is in <strong>${days} days</strong>.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard"
            style="display:inline-block;margin-top:16px;padding:12px 24px;background:#f59e0b;color:#000;border-radius:6px;text-decoration:none;font-weight:bold">
            View Dashboard
          </a>
        </div>`;

      try {
        await sendEmail(alertRow.email, subject, html);
        await supabase.from("alert_logs").insert({
          business_id: businessId,
          compliance_item_id: item.id,
          channel: "email",
          threshold_days: threshold,
          sent_to: alertRow.email,
          log_key: logKey,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send alert for ${item.name}:`, err);
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("/api/alerts/check failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}