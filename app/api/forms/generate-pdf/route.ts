import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";

type GenerateBody = {
  form_type: "ssm-borang-a" | "lhdn-cp204";
  business_id: string;
  extracted_data: {
    company_name?: string | null;
    reg_no?: string | null;
    issue_date?: string | null;
    expiry_date?: string | null;
    amount?: number | null;
  };
};

function splitDate(value: string | null | undefined): { dd: string; mm: string; yyyy: string } {
  if (!value) return { dd: "", mm: "", yyyy: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { dd: "", mm: "", yyyy: "" };
  return {
    dd: String(date.getDate()).padStart(2, "0"),
    mm: String(date.getMonth() + 1).padStart(2, "0"),
    yyyy: String(date.getFullYear()),
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    const body = (await req.json()) as GenerateBody;
    if (!body.business_id || !body.form_type) {
      return NextResponse.json({ error: "business_id and form_type are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error } = await supabase.from("businesses").select("*").eq("id", body.business_id).single();
    if (error || !business) {
      return NextResponse.json({ error: error?.message ?? "Business not found" }, { status: 404 });
    }

    const fontColor = rgb(0.05, 0.05, 0.05);

    if (body.form_type === "ssm-borang-a") {
      const templatePath = join(process.cwd(), "public", "forms", "borang-a.pdf");
      let templateBytes: Buffer;
      try {
        templateBytes = await readFile(templatePath);
      } catch {
        return NextResponse.json({ error: "Borang A template not found — add /public/forms/borang-a.pdf" }, { status: 500 });
      }

      const pdf = await PDFDocument.load(templateBytes);
      const page = pdf.getPage(0);
      const font = await pdf.embedFont(StandardFonts.Helvetica);

      const startDate = splitDate(body.extracted_data.expiry_date);
      const companyName = body.extracted_data.company_name ?? business.name ?? "";
      const regNo = body.extracted_data.reg_no ?? "";

      page.drawText(companyName, { x: 160, y: 556, size: 9, font, color: fontColor });
      page.drawText(startDate.dd, { x: 175, y: 520, size: 9, font, color: fontColor });
      page.drawText(startDate.mm, { x: 240, y: 520, size: 9, font, color: fontColor });
      page.drawText(startDate.yyyy, { x: 293, y: 520, size: 9, font, color: fontColor });
      page.drawText(business.location ?? "", { x: 160, y: 482, size: 9, font, color: fontColor });
      page.drawText(business.location ?? "", { x: 160, y: 442, size: 9, font, color: fontColor });
      page.drawText(business.state ?? "", { x: 340, y: 422, size: 9, font, color: fontColor });
      page.drawText(business.owner_email ?? "", { x: 450, y: 320, size: 8, font, color: fontColor });
      page.drawText(business.type ?? "", { x: 72, y: 285, size: 8, font, color: fontColor });
      if (regNo) page.drawText(regNo, { x: 430, y: 556, size: 8, font, color: fontColor });

      const bytes = await pdf.save();
      const filename = `SSM_BorangA_${regNo || "NA"}.pdf`;

      await supabase.from("form_submissions").insert({
        business_id: body.business_id,
        form_type: body.form_type,
        fields_used: body.extracted_data,
        filename,
      });

      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const companyName = body.extracted_data.company_name ?? business.name ?? "";
    const taxRef = body.extracted_data.reg_no ?? "";
    const issueDate = body.extracted_data.issue_date ?? new Date().toISOString().slice(0, 10);
    const estimatedTax = typeof body.extracted_data.amount === "number" ? body.extracted_data.amount : 0;
    const installment = estimatedTax > 0 ? Number((estimatedTax / 12).toFixed(2)) : 0;

    page.drawText("LHDN CP204 (Pre-filled)", { x: 40, y: 800, size: 16, font: bold, color: fontColor });
    page.drawText(`Company Name: ${companyName}`, { x: 40, y: 760, size: 11, font, color: fontColor });
    page.drawText(`Tax Ref No: ${taxRef}`, { x: 40, y: 738, size: 11, font, color: fontColor });
    page.drawText(`Accounting Period Start: ${issueDate}`, { x: 40, y: 716, size: 11, font, color: fontColor });
    page.drawText(`Accounting Period End: ${body.extracted_data.expiry_date ?? ""}`, { x: 40, y: 694, size: 11, font, color: fontColor });
    page.drawText(`Estimated Tax Payable: RM ${estimatedTax.toLocaleString("en-MY")}`, { x: 40, y: 672, size: 11, font, color: fontColor });
    page.drawText(`Installment Amount: RM ${installment.toLocaleString("en-MY")}`, { x: 40, y: 650, size: 11, font, color: fontColor });
    page.drawText(`Owner Email: ${business.owner_email ?? ""}`, { x: 40, y: 628, size: 11, font, color: fontColor });

    const bytes = await pdf.save();
    const filename = `LHDN_CP204_${taxRef || "NA"}.pdf`;

    await supabase.from("form_submissions").insert({
      business_id: body.business_id,
      form_type: body.form_type,
      fields_used: body.extracted_data,
      filename,
    });

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Generate PDF failed", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

