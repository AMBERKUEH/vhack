import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";

type SsmGenerateBody = {
  business_id: string;
  extracted_data: {
    company_name?: string | null;
    reg_no?: string | null;
    expiry_date?: string | null;
  };
};

function splitDate(value: string | null | undefined): { dd: string; mm: string; yyyy: string } {
  if (!value) return { dd: "", mm: "", yyyy: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { dd: "", mm: "", yyyy: "" };
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return { dd, mm, yyyy };
}

function extractPostcode(location: string | null): string {
  if (!location) return "";
  const match = location.match(/\b\d{5}\b/);
  return match?.[0] ?? "";
}

function cleanLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 500 });
    }

    const body = (await req.json()) as SsmGenerateBody;
    if (!body.business_id) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }

    const templatePath = join(process.cwd(), "public", "forms", "borang-a.pdf");
    let templateBytes: Buffer;
    try {
      templateBytes = await readFile(templatePath);
    } catch {
      return NextResponse.json(
        { error: "Borang A template not found — add /public/forms/borang-a.pdf" },
        { status: 500 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error } = await supabase.from("businesses").select("*").eq("id", body.business_id).single();
    if (error || !business) {
      return NextResponse.json({ error: error?.message ?? "Business not found" }, { status: 404 });
    }

    const doc = await PDFDocument.load(templateBytes);
    const page = doc.getPage(0);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const color = rgb(0.05, 0.05, 0.05);

    const date = splitDate(body.extracted_data?.expiry_date ?? null);
    const companyName = cleanLine(body.extracted_data?.company_name ?? business.name);
    const regNo = cleanLine(body.extracted_data?.reg_no);
    const location = cleanLine(business.location);
    const postcode = extractPostcode(business.location);
    const state = cleanLine(business.state);
    const businessType = cleanLine(business.type);
    const phone = cleanLine((business as { phone?: string | null }).phone ?? "-");
    const email = cleanLine(business.owner_email);

    page.drawText(companyName, { x: 160, y: 556, size: 9, font, color });
    page.drawText(date.dd, { x: 175, y: 520, size: 9, font, color });
    page.drawText(date.mm, { x: 240, y: 520, size: 9, font, color });
    page.drawText(date.yyyy, { x: 293, y: 520, size: 9, font, color });
    page.drawText(location, { x: 160, y: 482, size: 9, font, color });
    page.drawText(location, { x: 160, y: 442, size: 9, font, color });
    page.drawText(postcode, { x: 160, y: 422, size: 9, font, color });
    page.drawText(state, { x: 340, y: 422, size: 9, font, color });
    page.drawText(phone, { x: 160, y: 320, size: 9, font, color });
    page.drawText(email, { x: 450, y: 320, size: 8, font, color });
    page.drawText(businessType, { x: 72, y: 285, size: 8, font, color });
    if (regNo) {
      page.drawText(regNo, { x: 430, y: 556, size: 8, font, color });
    }

    const pdfBytes = await doc.save();
    const filename = `SSM_BorangA_${regNo || "NA"}.pdf`;

    await supabase.from("form_submissions").insert({
      business_id: body.business_id,
      form_type: "ssm-borang-a",
      fields_used: body.extracted_data ?? {},
      filename,
    });

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("SSM Borang A generation failed", error);
    return NextResponse.json({ error: "Failed to generate SSM Borang A PDF" }, { status: 500 });
  }
}

