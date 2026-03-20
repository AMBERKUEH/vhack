import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";
import { buildRiskData, formatRM, type ComplianceItem, type ItemStatus, type Priority } from "@/lib/risk";

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
      document_uploaded: docs.length > 0,
      expiry_date: docs[0]?.expiry_date ?? null,
    };
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }
    const body = (await req.json()) as { businessId?: string };
    if (!body.businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const [businessRes, itemsRes, grantsRes] = await Promise.all([
      supabase.from("businesses").select("*").eq("id", body.businessId).single(),
      supabase.from("compliance_items").select("*, documents(expiry_date, uploaded_at)").eq("business_id", body.businessId),
      supabase.from("grant_matches").select("*").eq("business_id", body.businessId).order("eligibility_pct", { ascending: false }),
    ]);

    if (businessRes.error || !businessRes.data) {
      return NextResponse.json({ error: businessRes.error?.message ?? "Business not found" }, { status: 404 });
    }

    const items = mapDbItems((itemsRes.data ?? []) as DbReportItemRow[]);
    const riskData = buildRiskData(items);
    const grants = grantsRes.data ?? [];

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0.05, 0.05, 0.05);
    let y = 810;

    const write = (text: string, size = 10, weight: "normal" | "bold" = "normal"): void => {
      page.drawText(text, { x: 40, y, size, font: weight === "bold" ? bold : font, color: black });
      y -= size + 6;
    };

    const generatedDate = new Date();
    write("Compliance Copilot - Health Report", 16, "bold");
    write(`Business: ${businessRes.data.name}`, 12, "bold");
    write(`Date: ${generatedDate.toLocaleDateString("en-GB")}`);
    write(`Risk Score: ${riskData.overall_score} (${riskData.risk_level})`);
    write(`Penalty Exposure: ${formatRM(riskData.penalty_exposure)}`);
    y -= 6;

    write("Compliance Items", 12, "bold");
    write("Name | Authority | Deadline | Status | Risk | Penalty", 9, "bold");
    for (const item of items.slice(0, 18)) {
      write(
        `${item.name} | ${item.authority} | ${item.deadline ?? "-"} | ${item.status.toUpperCase()} | ${item.risk_score} | ${formatRM(item.penalty_rm_min)}`,
        8,
      );
    }
    y -= 6;

    write("Upcoming Deadlines (next 90 days)", 12, "bold");
    if (riskData.forecast.length === 0) {
      write("None");
    } else {
      for (const f of riskData.forecast) {
        write(`In ${f.days_until_flip} days - ${f.item_name} will reach HIGH risk`, 9);
      }
    }
    y -= 6;

    write("Grants", 12, "bold");
    if (!grants.length) {
      write("No eligible grants.");
    } else {
      for (const grant of grants.slice(0, 10)) {
        write(`${grant.grant_name} - ${formatRM(grant.value_rm)} (${grant.grant_body})`, 9);
      }
    }
    y -= 10;

    write("Disclaimer: For official compliance advice, consult a qualified advisor.", 8);

    const bytes = await pdf.save();
    const safeName = String(businessRes.data.name ?? "Business").replace(/[^a-zA-Z0-9_-]+/g, "_");
    const dateStr = generatedDate.toISOString().slice(0, 10);
    const filename = `Compliance_Report_${safeName}_${dateStr}.pdf`;

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "x-filename": filename,
      },
    });
  } catch (error) {
    console.error("Report PDF generation failed", error);
    return NextResponse.json({ error: "Failed to generate report PDF" }, { status: 500 });
  }
}

