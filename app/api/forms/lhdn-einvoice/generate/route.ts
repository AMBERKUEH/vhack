import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";

type LhdnExtractedData = {
  document_type?: string | null;
  company_name?: string | null;
  reg_no?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  authority?: string | null;
  amount?: number | null;
  invoice_no?: string | null;
  supplier_name?: string | null;
  supplier_tin?: string | null;
  msic_code?: string | null;
  total_amount?: number | null;
  tax_amount?: number | null;
};

type LhdnGenerateBody = {
  business_id: string;
  extracted_data: LhdnExtractedData;
};

function num(value: number | null | undefined, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return fallback;
}

export async function POST(req: Request): Promise<NextResponse | Response> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 500 });
    }

    const body = (await req.json()) as LhdnGenerateBody;
    if (!body.business_id) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error } = await supabase.from("businesses").select("*").eq("id", body.business_id).single();
    if (error || !business) {
      return NextResponse.json({ error: error?.message ?? "Business not found" }, { status: 404 });
    }

    const now = new Date();
    const invoiceNo = body.extracted_data.invoice_no?.trim() || `INV-${now.getTime()}`;
    const issueDate = body.extracted_data.issue_date || now.toISOString().slice(0, 10);
    const taxAmount = num(body.extracted_data.tax_amount, 0);
    const totalFromReceipt = num(body.extracted_data.total_amount, num(body.extracted_data.amount, 0));
    const totalIncludingTax = totalFromReceipt > 0 ? totalFromReceipt : 0;
    const totalExcludingTax = Math.max(0, totalIncludingTax - taxAmount);
    const supplierName = body.extracted_data.supplier_name?.trim() || business.name;

    if (!invoiceNo) {
      return NextResponse.json({ error: "invoiceNo must exist" }, { status: 400 });
    }
    if (totalIncludingTax <= 0) {
      return NextResponse.json({ error: "totalIncludingTax must be > 0" }, { status: 400 });
    }
    if (!supplierName) {
      return NextResponse.json({ error: "supplier.name must exist" }, { status: 400 });
    }

    const payload = {
      invoiceTypeCode: "01",
      invoiceNo,
      invoiceDate: issueDate,
      supplier: {
        name: supplierName,
        tin: body.extracted_data.supplier_tin ?? "",
        msicCode: body.extracted_data.msic_code ?? "",
        address: business.location ?? "",
      },
      buyer: {
        name: business.name,
        tin: "",
      },
      lineItems: [
        {
          description: "Services/Goods",
          quantity: 1,
          unitPrice: totalIncludingTax,
          taxAmount,
          totalAmount: totalIncludingTax,
        },
      ],
      totalExcludingTax,
      totalTax: taxAmount,
      totalIncludingTax,
      currency: "MYR",
      generatedBy: "Compliance Copilot",
      generatedAt: new Date().toISOString(),
    };

    const filename = `LHDN_eInvoice_${invoiceNo}.json`;

    await supabase.from("form_submissions").insert({
      business_id: body.business_id,
      form_type: "lhdn-einvoice",
      fields_used: body.extracted_data ?? {},
      filename,
    });

    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("LHDN e-Invoice generation failed", error);
    return NextResponse.json({ error: "Failed to generate LHDN e-Invoice JSON" }, { status: 500 });
  }
}

