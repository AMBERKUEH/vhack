import Twilio from "twilio";
import { getSupabaseAdmin, isSimulationMode } from "@/lib/supabase";

/**
 * Sends a WhatsApp message via Twilio and logs errors without throwing.
 */
export async function sendWhatsApp(to: string, message: string): Promise<void> {
  if (
    isSimulationMode ||
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_WHATSAPP_FROM
  ) {
    console.log("[SIMULATED WHATSAPP]", { to, message });
    return;
  }

  try {
    const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    });
  } catch (error) {
    console.error("Twilio send failed", error);
  }
}

/**
 * Schedules immediate sends for deadlines at 90, 30, and 7 days away.
 */
export async function scheduleDeadlineAlerts(businessId: string): Promise<number> {
  const supabase = getSupabaseAdmin();

  const { data: business, error: businessErr } = await supabase
    .from("businesses")
    .select("phone")
    .eq("id", businessId)
    .single<{ phone: string | null }>();

  if (businessErr || !business?.phone) {
    return 0;
  }

  const { data: items, error } = await supabase
    .from("compliance_items")
    .select("name, deadline")
    .eq("business_id", businessId)
    .not("deadline", "is", null);

  if (error || !items) {
    return 0;
  }

  let sent = 0;

  for (const item of items) {
    if (!item.deadline) continue;

    const diff = Math.ceil((new Date(item.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if ([90, 30, 7].includes(diff)) {
      await sendWhatsApp(business.phone, `Peringatan: ${item.name} akan tamat dalam ${diff} hari.`);
      sent += 1;
    }
  }

  return sent;
}