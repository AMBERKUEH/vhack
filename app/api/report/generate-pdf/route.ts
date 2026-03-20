import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";
import { getItemRisk, getOverallScore, getPenaltyExposure, getRiskLevel, type ComplianceItem, type ItemStatus, type Priority } from "@/lib/risk";

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
  document_uploaded?: boolean | null;
  expiry_date?: string | null;
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
      document_uploaded: Boolean(item.document_uploaded) || docs.length > 0,
      expiry_date: docs[0]?.expiry_date ?? item.expiry_date ?? null,
    };
  });
}

function getRiskLabel(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

function daysUntil(dateStr: string | null | undefined): number {
  if (!dateStr) return Number.POSITIVE_INFINITY;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((target.getTime() - Date.now()) / 86400000);
}

function truncate(value: string, max = 25): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

function riskColor(score: number): ReturnType<typeof rgb> {
  if (score >= 70) return rgb(0.85, 0.2, 0.2);
  if (score >= 40) return rgb(0.9, 0.6, 0.1);
  return rgb(0.1, 0.65, 0.3);
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    const body = (await req.json()) as { business_id?: string; businessId?: string };
    const businessId = body.business_id ?? body.businessId;
    if (!businessId) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const [businessRes, itemsRes, grantsRes] = await Promise.all([
      supabase
        .from("businesses")
        .select("id, name, type, location, employees, state, council")
        .eq("id", businessId)
        .single(),
      supabase
        .from("compliance_items")
        .select("*, documents(expiry_date, uploaded_at)")
        .eq("business_id", businessId)
        .order("deadline", { ascending: true }),
      supabase
        .from("grant_matches")
        .select("grant_name, grant_body, value_rm, eligibility_pct, apply_url")
        .eq("business_id", businessId),
    ]);

    if (businessRes.error || !businessRes.data) {
      return NextResponse.json({ error: businessRes.error?.message ?? "Business not found" }, { status: 404 });
    }

    const items = mapDbItems((itemsRes.data ?? []) as DbReportItemRow[]).map((item) => ({
      ...item,
      risk_score: getItemRisk(item),
    }));
    const grants = grantsRes.data ?? [];

    const overallScore = getOverallScore(items);
    const penaltyExposure = getPenaltyExposure(items);
    const riskLabel = getRiskLabel(overallScore);
    const itemsAtRisk = items.filter((item) => item.risk_score >= 50).length;
    const missingDocs = items.filter((item) => !item.document_uploaded).length;
    const upcoming = items.filter((item) => {
      const d = daysUntil(item.deadline);
      return d >= 0 && d <= 90;
    });

    const pdfDoc = await PDFDocument.create();
    const page1 = pdfDoc.addPage([595, 842]);
    const page2 = pdfDoc.addPage([595, 842]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const BLACK = rgb(0.05, 0.05, 0.05);
    const WHITE = rgb(1, 1, 1);
    const GRAY = rgb(0.5, 0.5, 0.5);
    const LIGHT_GRAY = rgb(0.9, 0.9, 0.9);
    const RED = rgb(0.85, 0.2, 0.2);
    const AMBER = rgb(0.9, 0.6, 0.1);
    const GREEN = rgb(0.1, 0.65, 0.3);

    const generated = new Date();
    const reportDate = generated.toLocaleDateString("en-MY");

    page1.drawRectangle({ x: 0, y: 762, width: 595, height: 80, color: BLACK });
    page1.drawText("LULUS AI", { x: 50, y: 805, size: 20, font: bold, color: WHITE });
    page1.drawText("COMPLIANCE HEALTH REPORT", { x: 50, y: 785, size: 10, font, color: rgb(0.75, 0.75, 0.75) });
    page1.drawText(`Generated: ${reportDate}`, { x: 430, y: 796, size: 9, font, color: rgb(0.75, 0.75, 0.75) });

    let y = 730;
    page1.drawText(businessRes.data.name ?? "Your Business", { x: 50, y, size: 16, font: bold, color: BLACK });
    y -= 16;
    page1.drawText(
      `${businessRes.data.type ?? ""} | ${businessRes.data.location ?? ""} | ${businessRes.data.employees ?? 0} employees`,
      { x: 50, y, size: 10, font, color: GRAY },
    );

    y -= 26;
    page1.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: LIGHT_GRAY });

    y -= 28;
    page1.drawText("OVERALL COMPLIANCE RISK", { x: 50, y, size: 11, font: bold, color: GRAY });

    y -= 36;
    const scoreColor = riskColor(overallScore);
    page1.drawText(String(overallScore), { x: 50, y, size: 52, font: bold, color: scoreColor });
    page1.drawText("/ 100", { x: 118, y: y + 10, size: 16, font, color: GRAY });
    page1.drawRectangle({ x: 165, y: y + 8, width: 74, height: 24, color: scoreColor });
    page1.drawText(riskLabel, { x: 181, y: y + 15, size: 11, font: bold, color: WHITE });

    y -= 50;
    const cardW = 156;
    const cardH = 66;
    const gap = 12;
    const cardY = y - cardH;

    page1.drawRectangle({ x: 50, y: cardY, width: cardW, height: cardH, color: rgb(0.97, 0.97, 0.97), borderColor: LIGHT_GRAY, borderWidth: 0.5 });
    page1.drawText("PENALTY EXPOSURE", { x: 58, y: cardY + 48, size: 8, font, color: GRAY });
    page1.drawText(`RM ${penaltyExposure.toLocaleString("en-MY")}`, { x: 58, y: cardY + 28, size: 14, font: bold, color: RED });

    const card2X = 50 + cardW + gap;
    page1.drawRectangle({ x: card2X, y: cardY, width: cardW, height: cardH, color: rgb(0.97, 0.97, 0.97), borderColor: LIGHT_GRAY, borderWidth: 0.5 });
    page1.drawText("ITEMS AT RISK", { x: card2X + 8, y: cardY + 48, size: 8, font, color: GRAY });
    page1.drawText(`${itemsAtRisk} of ${items.length}`, { x: card2X + 8, y: cardY + 28, size: 15, font: bold, color: AMBER });

    const card3X = card2X + cardW + gap;
    page1.drawRectangle({ x: card3X, y: cardY, width: cardW, height: cardH, color: rgb(0.97, 0.97, 0.97), borderColor: LIGHT_GRAY, borderWidth: 0.5 });
    page1.drawText("MISSING DOCUMENTS", { x: card3X + 8, y: cardY + 48, size: 8, font, color: GRAY });
    page1.drawText(String(missingDocs), { x: card3X + 8, y: cardY + 28, size: 16, font: bold, color: missingDocs > 0 ? RED : GREEN });

    y = cardY - 24;
    page1.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: LIGHT_GRAY });

    y -= 20;
    page1.drawText("UPCOMING DEADLINES - NEXT 90 DAYS", { x: 50, y, size: 11, font: bold, color: BLACK });
    y -= 20;

    if (upcoming.length === 0) {
      page1.drawText("No deadlines in the next 90 days.", { x: 50, y, size: 10, font, color: GRAY });
    } else {
      for (const item of upcoming.slice(0, 6)) {
        const d = daysUntil(item.deadline);
        page1.drawText(truncate(item.name, 30), { x: 50, y, size: 10, font: bold, color: BLACK });
        page1.drawText(item.authority, { x: 265, y, size: 10, font, color: GRAY });
        page1.drawText(`${d} days`, { x: 350, y, size: 10, font: bold, color: riskColor(item.risk_score) });
        page1.drawText(item.deadline ?? "", { x: 430, y, size: 9, font, color: GRAY });
        y -= 18;
        if (y < 90) break;
      }
    }

    page1.drawLine({ start: { x: 50, y: 40 }, end: { x: 545, y: 40 }, thickness: 0.5, color: LIGHT_GRAY });
    page1.drawText("This report is for reference only. Verify with relevant government authority. | Page 1", {
      x: 50,
      y: 25,
      size: 7,
      font,
      color: GRAY,
    });

    page2.drawRectangle({ x: 0, y: 792, width: 595, height: 50, color: BLACK });
    page2.drawText("LULUS AI - Compliance Health Report", { x: 50, y: 812, size: 11, font: bold, color: WHITE });
    page2.drawText(businessRes.data.name ?? "", { x: 390, y: 812, size: 9, font, color: rgb(0.75, 0.75, 0.75) });

    let y2 = 770;
    page2.drawRectangle({ x: 50, y: y2 - 5, width: 495, height: 20, color: rgb(0.12, 0.12, 0.12) });
    page2.drawText("ITEM", { x: 56, y: y2 + 2, size: 8, font: bold, color: WHITE });
    page2.drawText("AUTHORITY", { x: 220, y: y2 + 2, size: 8, font: bold, color: WHITE });
    page2.drawText("DEADLINE", { x: 300, y: y2 + 2, size: 8, font: bold, color: WHITE });
    page2.drawText("DOCUMENT", { x: 380, y: y2 + 2, size: 8, font: bold, color: WHITE });
    page2.drawText("RISK", { x: 470, y: y2 + 2, size: 8, font: bold, color: WHITE });
    y2 -= 22;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const rowBg = i % 2 === 0 ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.97);
      page2.drawRectangle({ x: 50, y: y2 - 5, width: 495, height: 18, color: rowBg });

      page2.drawText(truncate(item.name, 25), { x: 56, y: y2 + 2, size: 8, font, color: BLACK });
      page2.drawText(truncate(item.authority, 10), { x: 220, y: y2 + 2, size: 8, font, color: GRAY });
      page2.drawText(item.deadline ?? "Not set", { x: 300, y: y2 + 2, size: 8, font, color: GRAY });
      page2.drawText(item.document_uploaded ? "Uploaded" : "Missing", {
        x: 380,
        y: y2 + 2,
        size: 8,
        font,
        color: item.document_uploaded ? GREEN : RED,
      });

      const level = item.risk_score >= 70 ? "HIGH" : item.risk_score >= 40 ? "MED" : "LOW";
      page2.drawText(level, { x: 470, y: y2 + 2, size: 8, font: bold, color: riskColor(item.risk_score) });

      y2 -= 18;
      if (y2 < 150) break;
    }

    if (grants.length > 0 && y2 > 130) {
      y2 -= 10;
      page2.drawLine({ start: { x: 50, y: y2 + 10 }, end: { x: 545, y: y2 + 10 }, thickness: 0.5, color: LIGHT_GRAY });
      y2 -= 12;
      page2.drawText("GRANT OPPORTUNITIES", { x: 50, y: y2, size: 11, font: bold, color: BLACK });
      y2 -= 18;

      for (const grant of grants.slice(0, 4)) {
        page2.drawText(truncate(String(grant.grant_name ?? ""), 28), { x: 50, y: y2, size: 9, font: bold, color: BLACK });
        page2.drawText(`RM ${Number(grant.value_rm ?? 0).toLocaleString("en-MY")}`, { x: 270, y: y2, size: 9, font: bold, color: GREEN });
        page2.drawText(`${Number(grant.eligibility_pct ?? 0)}%`, { x: 360, y: y2, size: 8, font, color: GRAY });
        page2.drawText(truncate(String(grant.apply_url ?? ""), 25), { x: 410, y: y2, size: 8, font, color: GRAY });
        y2 -= 14;
      }
    }

    page2.drawLine({ start: { x: 50, y: 40 }, end: { x: 545, y: 40 }, thickness: 0.5, color: LIGHT_GRAY });
    page2.drawText("This report is for reference only. Verify with relevant government authority. | Page 2", {
      x: 50,
      y: 25,
      size: 7,
      font,
      color: GRAY,
    });

    const pdfBytes = await pdfDoc.save();
    const safeName = String(businessRes.data.name ?? "Business").replace(/[^a-zA-Z0-9_-]+/g, "_");
    const date = generated.toISOString().slice(0, 10);
    const filename = `LULUSAI_Report_${safeName}_${date}.pdf`;

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
