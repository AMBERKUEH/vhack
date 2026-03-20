import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";

type FormType = "ssm" | "lhdn-cp204";

type GenerateBody = {
  form_type: FormType;
  business_id: string;
  fields: Record<string, string>;
};

type BusinessRow = {
  id: string;
  name: string | null;
  location: string | null;
  state: string | null;
  council: string | null;
  employees: number | null;
  type: string | null;
  owner_email: string | null;
  created_at: string | null;
};

function todayParts(): { yyyy: string; mm: string; dd: string; ymd: string; display: string } {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return {
    yyyy,
    mm,
    dd,
    ymd: `${yyyy}-${mm}-${dd}`,
    display: d.toLocaleDateString("en-MY"),
  };
}

function createdDateParts(createdAt: string | null): { dd: string; mm: string; yyyy: string } {
  const fallback = todayParts();
  if (!createdAt) return { dd: fallback.dd, mm: fallback.mm, yyyy: fallback.yyyy };
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return { dd: fallback.dd, mm: fallback.mm, yyyy: fallback.yyyy };
  return {
    dd: String(parsed.getDate()).padStart(2, "0"),
    mm: String(parsed.getMonth() + 1).padStart(2, "0"),
    yyyy: String(parsed.getFullYear()),
  };
}

function toUpper(value: string): string {
  return value.trim().toUpperCase();
}

function drawUpper(page: PDFPage, font: PDFFont, bold: PDFFont, text: string, x: number, y: number, size = 9, useBold = false): void {
  const value = toUpper(text);
  if (!value) return;
  page.drawText(value, {
    x,
    y,
    size,
    font: useBold ? bold : font,
    color: rgb(0, 0, 0),
  });
}

function parseMyKad(raw: string): { p1: string; p2: string; p3: string } {
  const cleaned = raw.replace(/-/g, "").trim();
  return {
    p1: cleaned.slice(0, 6),
    p2: cleaned.slice(6, 8),
    p3: cleaned.slice(8, 12),
  };
}

function parseAmount(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function resolveUserEmail(req: Request, fallback: string): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) return fallback;

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return fallback;

  const browserSupabase = createClient(supabaseUrl, supabaseAnon);
  const { data, error } = await browserSupabase.auth.getUser(token);
  if (error || !data.user?.email) return fallback;
  return data.user.email;
}

function filenameSafe(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]+/g, "_");
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    const body = (await req.json()) as GenerateBody;
    if (!body.form_type || !body.business_id || !body.fields) {
      return NextResponse.json({ error: "form_type, business_id, and fields are required" }, { status: 400 });
    }
    if (body.form_type !== "ssm" && body.form_type !== "lhdn-cp204") {
      return NextResponse.json({ error: "Invalid form_type" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, location, state, council, employees, type, owner_email, created_at")
      .eq("id", body.business_id)
      .single<BusinessRow>();

    if (businessError || !business) {
      return NextResponse.json({ error: businessError?.message ?? "Business not found" }, { status: 404 });
    }

    const t = todayParts();
    const start = createdDateParts(business.created_at);
    const userEmail = await resolveUserEmail(req, business.owner_email ?? "");

    let pdfBytes: Uint8Array;
    let filename: string;

    if (body.form_type === "ssm") {
      const formPath = join(process.cwd(), "public", "forms", "borang-a.pdf");
      let templateBytes: Buffer;
      try {
        templateBytes = await readFile(formPath);
      } catch {
        return NextResponse.json({ error: "SSM form template not found. Please contact support." }, { status: 500 });
      }

      const pdfDoc = await PDFDocument.load(templateBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      if (pages.length < 2) {
        return NextResponse.json({ error: "SSM form template is invalid. Please contact support." }, { status: 500 });
      }

      const page1 = pages[0];
      const page2 = pages[1];
      const f = body.fields;

      drawUpper(page1, font, bold, f.nama_perniagaan || business.name || "", 160, 561, 9, true);
      drawUpper(page1, font, bold, f.tarikh_dd || start.dd, 175, 525, 9);
      drawUpper(page1, font, bold, f.tarikh_mm || start.mm, 240, 525, 9);
      drawUpper(page1, font, bold, f.tarikh_yyyy || start.yyyy, 293, 525, 9);
      drawUpper(page1, font, bold, f.alamat || business.location || "", 160, 479, 9);
      drawUpper(page1, font, bold, f.alamat_line2 || "", 160, 462, 9);
      drawUpper(page1, font, bold, f.bandar || business.council || business.location || "", 160, 438, 9);
      drawUpper(page1, font, bold, f.poskod || "", 160, 421, 9);
      drawUpper(page1, font, bold, f.negeri || business.state || "", 340, 421, 9);
      drawUpper(page1, font, bold, f.no_telefon || "", 160, 324, 9);
      drawUpper(page1, font, bold, f.emel || userEmail, 450, 324, 9);
      drawUpper(page1, font, bold, f.jenis_perniagaan || business.type || "", 72, 283, 9);

      drawUpper(page2, font, bold, f.nama_pemilik || "", 160, 713, 9, true);
      const mykad = parseMyKad(f.no_mykad || "");
      drawUpper(page2, font, bold, mykad.p1, 160, 680, 9);
      drawUpper(page2, font, bold, mykad.p2, 255, 680, 9);
      drawUpper(page2, font, bold, mykad.p3, 305, 680, 9);

      const dob = (f.tarikh_lahir || "").trim();
      if (dob) {
        const [dobY = "", dobM = "", dobD = ""] = dob.split("-");
        drawUpper(page2, font, bold, dobD, 148, 663, 9);
        drawUpper(page2, font, bold, dobM, 196, 663, 9);
        drawUpper(page2, font, bold, dobY, 242, 663, 9);
      }

      drawUpper(page2, font, bold, f.alamat_kediaman || business.location || "", 160, 605, 9);
      drawUpper(page2, font, bold, f.bandar_kediaman || business.council || "", 160, 552, 9);
      drawUpper(page2, font, bold, f.poskod_kediaman || "", 160, 534, 9);
      drawUpper(page2, font, bold, f.negeri_kediaman || business.state || "", 300, 534, 9);
      drawUpper(page2, font, bold, f.no_telefon_pemilik || "", 160, 515, 9);

      drawUpper(page2, font, bold, t.dd, 175, 79, 9);
      drawUpper(page2, font, bold, t.mm, 230, 79, 9);
      drawUpper(page2, font, bold, t.yyyy, 280, 79, 9);

      page1.drawText(`Auto-filled by LULUS AI on ${t.display}`.toUpperCase(), {
        x: 160,
        y: 25,
        size: 7,
        font,
        color: rgb(0.1, 0.5, 0.2),
        opacity: 0.7,
      });

      pdfBytes = await pdfDoc.save();
      filename = `LULUSAI_SSM_BorangA_${filenameSafe(business.name ?? "draft")}_${t.yyyy}${t.mm}${t.dd}.pdf`;
    } else {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const PAGE_WIDTH = 595;
      const PAGE_HEIGHT = 842;
      const MARGIN = 50;
      const BLACK = rgb(0, 0, 0);
      const WHITE = rgb(1, 1, 1);
      const GRAY = rgb(0.5, 0.5, 0.5);
      const GREEN = rgb(0.1, 0.65, 0.3);
      const LIGHT_GREEN = rgb(0.9, 0.98, 0.92);
      const LIGHT_GRAY = rgb(0.9, 0.9, 0.9);

      const drawField = (label: string, value: string, yPos: number, isFilled = false): void => {
        page.drawText(label, { x: MARGIN, y: yPos + 2, font, size: 8, color: GRAY });
        page.drawRectangle({
          x: MARGIN,
          y: yPos - 16,
          width: PAGE_WIDTH - MARGIN * 2,
          height: 18,
          color: isFilled ? LIGHT_GREEN : rgb(0.97, 0.97, 0.97),
          borderColor: isFilled ? GREEN : LIGHT_GRAY,
          borderWidth: isFilled ? 1 : 0.5,
        });
        page.drawText(value || "(not provided)", {
          x: MARGIN + 6,
          y: yPos - 10,
          font: value ? bold : font,
          size: 9,
          color: value ? BLACK : GRAY,
        });
        if (isFilled && value) {
          page.drawText("auto-filled", { x: PAGE_WIDTH - MARGIN - 55, y: yPos - 10, font, size: 7, color: GREEN });
        }
      };

      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 80, width: PAGE_WIDTH, height: 80, color: rgb(0.05, 0.05, 0.05) });
      page.drawText("LEMBAGA HASIL DALAM NEGERI MALAYSIA (LHDN)", {
        x: MARGIN,
        y: PAGE_HEIGHT - 35,
        font: bold,
        size: 13,
        color: WHITE,
      });
      page.drawText("BORANG CP204 - ANGGARAN CUKAI YANG KENA DIBAYAR", {
        x: MARGIN,
        y: PAGE_HEIGHT - 55,
        font,
        size: 10,
        color: rgb(0.7, 0.7, 0.7),
      });

      const f = body.fields;
      const currentYear = new Date().getFullYear();
      const estimatedTax = parseAmount(f.estimated_tax_payable);
      const installment = estimatedTax !== null ? `RM ${(estimatedTax / 12).toFixed(2)}` : "";

      let y = PAGE_HEIGHT - 130;
      drawField("NAMA SYARIKAT", f.company_name || business.name || "", y, Boolean(f.company_name || business.name));
      y -= 40;
      drawField("NO. RUJUKAN CUKAI", f.tax_ref_no || "", y, Boolean(f.tax_ref_no));
      y -= 40;
      drawField("TARIKH MULA (PERIOD)", f.accounting_period_start || `01/01/${currentYear}`, y, true);
      y -= 40;
      drawField("TARIKH AKHIR (PERIOD)", f.accounting_period_end || `31/12/${currentYear}`, y, true);
      y -= 40;
      drawField("ANGGARAN CUKAI (RM)", f.estimated_tax_payable || "", y, Boolean(f.estimated_tax_payable));
      y -= 40;
      drawField("ANSURAN BULANAN (RM)", f.installment_amount || installment, y, Boolean(f.installment_amount || installment));
      y -= 50;

      page.drawRectangle({ x: MARGIN, y: y - 5, width: 220, height: 24, color: LIGHT_GREEN, borderColor: GREEN, borderWidth: 1 });
      page.drawText(`Auto-filled by LULUS AI | ${t.display}`, {
        x: MARGIN + 8,
        y: y + 4,
        font: bold,
        size: 9,
        color: rgb(0.05, 0.5, 0.2),
      });

      page.drawLine({ start: { x: MARGIN, y: 55 }, end: { x: PAGE_WIDTH - MARGIN, y: 55 }, thickness: 0.5, color: LIGHT_GRAY });
      page.drawText("DRAFT ONLY - This is a pre-filled draft generated by LULUS AI for reference purposes.", {
        x: MARGIN,
        y: 42,
        font: bold,
        size: 8,
        color: rgb(0.7, 0.3, 0.1),
      });
      page.drawText("Please verify all information before submitting to the relevant government authority.", {
        x: MARGIN,
        y: 30,
        font,
        size: 8,
        color: GRAY,
      });
      page.drawText(`Generated on ${t.display} by LULUS AI`, {
        x: MARGIN,
        y: 18,
        font,
        size: 7,
        color: GRAY,
      });

      pdfBytes = await pdfDoc.save();
      filename = `LULUSAI_LHDN_CP204_${filenameSafe(business.name ?? "draft")}_${t.yyyy}${t.mm}${t.dd}.pdf`;
    }

    const { error: insertError } = await supabase.from("form_submissions").insert({
      business_id: body.business_id,
      form_type: body.form_type,
      fields_used: body.fields,
      filename,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (error) {
    console.error("Form PDF error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate form PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
