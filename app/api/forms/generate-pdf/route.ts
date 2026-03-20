import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";

type FormType = "ssm" | "lhdn-cp204";

type GenerateBody = {
  form_type: FormType;
  business_id: string;
  fields: Record<string, string>;
};

function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseAmount(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function drawField(
  page: import("pdf-lib").PDFPage,
  font: import("pdf-lib").PDFFont,
  bold: import("pdf-lib").PDFFont,
  label: string,
  value: string,
  y: number,
  autoFilled: boolean,
): void {
  const labelColor = rgb(0.45, 0.45, 0.45);
  const autoBg = rgb(0.92, 0.98, 0.93);
  const autoBorder = rgb(0.13, 0.68, 0.33);
  const emptyBg = rgb(0.96, 0.96, 0.96);
  const emptyBorder = rgb(0.75, 0.75, 0.75);
  const textColor = rgb(0.08, 0.08, 0.08);

  page.drawText(label, { x: 50, y: y + 22, size: 8, font, color: labelColor });
  page.drawRectangle({
    x: 50,
    y,
    width: 495,
    height: 20,
    color: autoFilled ? autoBg : emptyBg,
    borderColor: autoFilled ? autoBorder : emptyBorder,
    borderWidth: 1,
  });

  const display = value.trim() ? value : "(not provided)";
  page.drawText(display, { x: 56, y: y + 6, size: 10, font: value.trim() ? font : bold, color: textColor });
  page.drawText(autoFilled ? "auto-filled" : "manual", {
    x: 480,
    y: y + 6,
    size: 8,
    font,
    color: autoFilled ? autoBorder : labelColor,
  });
}

async function resolveUserEmail(req: Request): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;

  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return null;
  return data.user.email;
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    const body = (await req.json()) as GenerateBody;
    if (!body.business_id || !body.form_type || !body.fields) {
      return NextResponse.json({ error: "form_type, business_id, and fields are required" }, { status: 400 });
    }
    if (body.form_type !== "ssm" && body.form_type !== "lhdn-cp204") {
      return NextResponse.json({ error: "form_type must be 'ssm' or 'lhdn-cp204'" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, location, state, council, employees, type, owner_email, created_at")
      .eq("id", body.business_id)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: businessError?.message ?? "Business not found" }, { status: 404 });
    }

    const authEmail = await resolveUserEmail(req);
    const userEmail = authEmail ?? business.owner_email ?? "";

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const BLACK = rgb(0.05, 0.05, 0.05);
    const WHITE = rgb(1, 1, 1);
    const ORANGE = rgb(0.9, 0.45, 0.1);
    const GREEN = rgb(0.15, 0.7, 0.35);

    const date = todayYmd();

    const title = body.form_type === "ssm" ? "SSM BORANG A" : "LHDN CP204";
    const gov = body.form_type === "ssm" ? "SURUHANJAYA SYARIKAT MALAYSIA" : "LEMBAGA HASIL DALAM NEGERI";

    page.drawRectangle({ x: 0, y: 772, width: 595, height: 70, color: BLACK });
    page.drawText(gov, { x: 50, y: 812, size: 10, font, color: WHITE });
    page.drawText(title, { x: 50, y: 790, size: 20, font: bold, color: WHITE });

    const fields = body.fields;

    const year = new Date().getFullYear();
    const estimatedTax = parseAmount(fields.estimated_tax_payable);
    const installment = estimatedTax !== null ? (estimatedTax / 12).toFixed(2) : "";

    const ssmRows: Array<{ label: string; value: string; auto: boolean }> = [
      { label: "NAMA PERNIAGAAN", value: fields.nama_perniagaan || business.name || "", auto: !fields.nama_perniagaan },
      { label: "TARIKH MULA BERNIAGA", value: fields.tarikh_mula_berniaga || String(business.created_at || date).slice(0, 10), auto: !fields.tarikh_mula_berniaga },
      { label: "ALAMAT", value: fields.alamat || business.location || "", auto: !fields.alamat },
      { label: "BANDAR", value: fields.bandar || business.council || business.location || "", auto: !fields.bandar },
      { label: "POSKOD", value: fields.poskod || "", auto: false },
      { label: "NEGERI", value: fields.negeri || business.state || "", auto: !fields.negeri },
      { label: "NO. TELEFON", value: fields.no_telefon || "", auto: false },
      { label: "E-MEL", value: fields.emel || userEmail, auto: !fields.emel },
      { label: "JENIS PERNIAGAAN", value: fields.jenis_perniagaan || business.type || "", auto: !fields.jenis_perniagaan },
      { label: "NAMA PEMILIK", value: fields.nama_pemilik || "", auto: false },
      { label: "NO. MYKAD/MYPR", value: fields.no_mykad || "", auto: false },
      { label: "TARIKH PERMOHONAN", value: date, auto: true },
    ];

    const lhdnRows: Array<{ label: string; value: string; auto: boolean }> = [
      { label: "NAMA SYARIKAT", value: fields.company_name || business.name || "", auto: !fields.company_name },
      { label: "NO. RUJUKAN CUKAI", value: fields.tax_ref_no || "", auto: false },
      { label: "TARIKH MULA (PERIOD)", value: fields.accounting_period_start || `01/01/${year}`, auto: !fields.accounting_period_start },
      { label: "TARIKH AKHIR (PERIOD)", value: fields.accounting_period_end || `31/12/${year}`, auto: !fields.accounting_period_end },
      { label: "ANGGARAN CUKAI (RM)", value: fields.estimated_tax_payable || "", auto: false },
      { label: "ANSURAN BULANAN (RM)", value: fields.installment_amount || installment, auto: !fields.installment_amount },
    ];

    const rows = body.form_type === "ssm" ? ssmRows : lhdnRows;

    let y = 730;
    for (const row of rows) {
      drawField(page, font, bold, row.label, row.value, y, row.auto);
      y -= 44;
    }

    page.drawRectangle({ x: 50, y: 108, width: 495, height: 24, color: rgb(0.9, 0.98, 0.92), borderColor: GREEN, borderWidth: 1 });
    page.drawText(`Auto-filled by LULUS AI | ${date}`, { x: 58, y: 116, size: 10, font: bold, color: GREEN });

    page.drawText("DRAFT ONLY - This is a pre-filled draft generated by LULUS AI for reference purposes.", {
      x: 50,
      y: 74,
      size: 9,
      font: bold,
      color: ORANGE,
    });
    page.drawText("Please verify all information before submitting to the relevant government authority.", {
      x: 50,
      y: 60,
      size: 8,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
    page.drawText(`Generated on ${date} by LULUS AI`, {
      x: 50,
      y: 48,
      size: 8,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });

    const bytes = await pdfDoc.save();

    const safeName = String(business.name ?? "Business").replace(/[^a-zA-Z0-9_-]+/g, "_");
    const filename =
      body.form_type === "ssm"
        ? `LULUSAI_SSM_BorangA_${safeName}_${date}.pdf`
        : `LULUSAI_LHDN_CP204_${safeName}_${date}.pdf`;

    const { error: saveError } = await supabase.from("form_submissions").insert({
      business_id: body.business_id,
      form_type: body.form_type,
      fields_used: body.fields,
      filename,
    });

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Form PDF generation failed:", error);
    return NextResponse.json({ error: "Failed to generate form PDF" }, { status: 500 });
  }
}
