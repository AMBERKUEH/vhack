import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type TaxType = "SST 6%" | "SST 0%" | "Exempt" | "None";

type LineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type: TaxType;
  tax_rate: number;
  tax_amount: number;
  total: number;
};

type InvoiceFields = {
  supplier_name: string;
  supplier_tin: string;
  supplier_reg_no: string;
  supplier_msic: string;
  supplier_address: string;
  supplier_phone: string;
  supplier_email: string;
  buyer_name: string;
  buyer_tin: string;
  buyer_reg_no: string;
  buyer_address: string;
  invoice_number: string;
  invoice_date: string;
  invoice_time: string;
  currency: string;
  exchange_rate: string;
  line_items: LineItem[];
  subtotal: number;
  tax_total: number;
  grand_total: number;
};

type GenerateBody = { fields?: Partial<InvoiceFields> };

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeTaxType(value: string): TaxType {
  if (value === "SST 0%") return "SST 0%";
  if (value === "Exempt") return "Exempt";
  if (value === "None") return "None";
  return "SST 6%";
}

function normalizeFields(input: Partial<InvoiceFields>): InvoiceFields {
  const lineItems = (input.line_items ?? []).map((line) => {
    const quantity = Math.max(0, toNumber(line.quantity, 1));
    const unitPrice = Math.max(0, toNumber(line.unit_price, 0));
    const taxType = normalizeTaxType(String(line.tax_type ?? "SST 6%"));
    const taxRate = taxType === "SST 6%" ? 0.06 : 0;
    const lineExtension = quantity * unitPrice;
    const taxAmount = Number((lineExtension * taxRate).toFixed(2));
    const total = Number((lineExtension + taxAmount).toFixed(2));
    return {
      description: String(line.description ?? ""),
      quantity,
      unit_price: unitPrice,
      tax_type: taxType,
      tax_rate: Number((line.tax_rate ?? taxRate).toFixed(2)),
      tax_amount: toNumber(line.tax_amount, taxAmount),
      total: toNumber(line.total, total),
    } satisfies LineItem;
  });

  const subtotal = Number(
    (lineItems.length > 0
      ? lineItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
      : toNumber(input.subtotal, 0)
    ).toFixed(2),
  );
  const taxTotal = Number(
    (lineItems.length > 0 ? lineItems.reduce((sum, item) => sum + item.tax_amount, 0) : toNumber(input.tax_total, 0)).toFixed(2),
  );
  const grandTotal = Number(
    (lineItems.length > 0 ? subtotal + taxTotal : toNumber(input.grand_total, subtotal + taxTotal)).toFixed(2),
  );

  return {
    supplier_name: String(input.supplier_name ?? ""),
    supplier_tin: String(input.supplier_tin ?? ""),
    supplier_reg_no: String(input.supplier_reg_no ?? ""),
    supplier_msic: String(input.supplier_msic ?? ""),
    supplier_address: String(input.supplier_address ?? ""),
    supplier_phone: String(input.supplier_phone ?? ""),
    supplier_email: String(input.supplier_email ?? ""),
    buyer_name: String(input.buyer_name ?? ""),
    buyer_tin: String(input.buyer_tin ?? ""),
    buyer_reg_no: String(input.buyer_reg_no ?? ""),
    buyer_address: String(input.buyer_address ?? ""),
    invoice_number: String(input.invoice_number ?? ""),
    invoice_date: String(input.invoice_date ?? ""),
    invoice_time: String(input.invoice_time ?? ""),
    currency: String(input.currency ?? "MYR"),
    exchange_rate: String(input.exchange_rate ?? "1.0"),
    line_items: lineItems,
    subtotal,
    tax_total: taxTotal,
    grand_total: grandTotal,
  };
}

function validate(fields: InvoiceFields): string | null {
  if (!fields.supplier_name.trim()) return "supplier_name is required";
  if (!fields.buyer_name.trim()) return "buyer_name is required";
  if (!fields.invoice_number.trim()) return "invoice_number is required";
  if (!fields.invoice_date.trim()) return "invoice_date is required";
  if (!fields.line_items.length) return "At least one line item is required";
  const badLine = fields.line_items.find(
    (item) => !item.description.trim() || item.quantity <= 0 || item.unit_price < 0,
  );
  if (badLine) return "Each line item must include description, quantity > 0, and non-negative price";
  return null;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as GenerateBody;
    const fields = normalizeFields(body.fields ?? {});
    const error = validate(fields);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const width = 595;
    const height = 842;
    const margin = 48;
    const text = rgb(0.1, 0.1, 0.1);
    const soft = rgb(0.4, 0.4, 0.4);
    const line = rgb(0.85, 0.85, 0.85);

    let y = height - 56;
    page.drawText(fields.supplier_name || "SUPPLIER", {
      x: margin,
      y,
      font: bold,
      size: 18,
      color: text,
    });
    y -= 18;
    page.drawText(fields.supplier_address || "-", { x: margin, y, font: regular, size: 10, color: soft });
    y -= 14;
    page.drawText(`Phone: ${fields.supplier_phone || "-"}`, { x: margin, y, font: regular, size: 10, color: soft });
    y -= 14;
    page.drawText(`Email: ${fields.supplier_email || "-"}`, { x: margin, y, font: regular, size: 10, color: soft });

    page.drawText("INVOICE", {
      x: width - 170,
      y: height - 58,
      font: bold,
      size: 24,
      color: text,
    });
    page.drawText(`No: ${fields.invoice_number}`, {
      x: width - 170,
      y: height - 84,
      font: regular,
      size: 10,
      color: soft,
    });
    page.drawText(`Date: ${fields.invoice_date}`, {
      x: width - 170,
      y: height - 98,
      font: regular,
      size: 10,
      color: soft,
    });

    page.drawLine({
      start: { x: margin, y: height - 130 },
      end: { x: width - margin, y: height - 130 },
      thickness: 1,
      color: line,
    });

    page.drawText("BILL TO", { x: margin, y: height - 158, font: bold, size: 11, color: text });
    page.drawText(fields.buyer_name || "-", { x: margin, y: height - 174, font: regular, size: 10, color: soft });
    page.drawText(fields.buyer_address || "-", { x: margin, y: height - 188, font: regular, size: 10, color: soft });

    const tableTop = height - 232;
    const columns = {
      no: margin,
      desc: margin + 34,
      qty: margin + 260,
      unit: margin + 320,
      tax: margin + 400,
      total: margin + 472,
    };

    page.drawRectangle({
      x: margin,
      y: tableTop - 16,
      width: width - margin * 2,
      height: 20,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText("No.", { x: columns.no + 3, y: tableTop - 10, font: bold, size: 9, color: rgb(1, 1, 1) });
    page.drawText("Description", { x: columns.desc, y: tableTop - 10, font: bold, size: 9, color: rgb(1, 1, 1) });
    page.drawText("Qty", { x: columns.qty, y: tableTop - 10, font: bold, size: 9, color: rgb(1, 1, 1) });
    page.drawText("Unit Price", { x: columns.unit, y: tableTop - 10, font: bold, size: 9, color: rgb(1, 1, 1) });
    page.drawText("Tax", { x: columns.tax, y: tableTop - 10, font: bold, size: 9, color: rgb(1, 1, 1) });
    page.drawText("Total", { x: columns.total, y: tableTop - 10, font: bold, size: 9, color: rgb(1, 1, 1) });

    let rowY = tableTop - 36;
    fields.line_items.forEach((item, index) => {
      if (index % 2 === 1) {
        page.drawRectangle({
          x: margin,
          y: rowY - 3,
          width: width - margin * 2,
          height: 18,
          color: rgb(0.97, 0.97, 0.97),
        });
      }

      const desc = item.description.length > 38 ? `${item.description.slice(0, 38)}...` : item.description;
      page.drawText(String(index + 1), { x: columns.no + 4, y: rowY, font: regular, size: 9, color: text });
      page.drawText(desc, { x: columns.desc, y: rowY, font: regular, size: 9, color: text });
      page.drawText(item.quantity.toFixed(2), { x: columns.qty, y: rowY, font: regular, size: 9, color: text });
      page.drawText(`RM ${item.unit_price.toFixed(2)}`, { x: columns.unit, y: rowY, font: regular, size: 9, color: text });
      page.drawText(`RM ${item.tax_amount.toFixed(2)}`, { x: columns.tax, y: rowY, font: regular, size: 9, color: text });
      page.drawText(`RM ${item.total.toFixed(2)}`, { x: columns.total, y: rowY, font: regular, size: 9, color: text });
      rowY -= 20;
    });

    const boxWidth = 210;
    const boxX = width - margin - boxWidth;
    let boxY = rowY - 12;

    page.drawRectangle({
      x: boxX,
      y: boxY - 72,
      width: boxWidth,
      height: 78,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: line,
      borderWidth: 1,
    });

    page.drawText("Subtotal:", { x: boxX + 12, y: boxY - 16, font: regular, size: 10, color: soft });
    page.drawText(`RM ${fields.subtotal.toFixed(2)}`, { x: boxX + 120, y: boxY - 16, font: regular, size: 10, color: text });
    page.drawText("Tax:", { x: boxX + 12, y: boxY - 34, font: regular, size: 10, color: soft });
    page.drawText(`RM ${fields.tax_total.toFixed(2)}`, { x: boxX + 120, y: boxY - 34, font: regular, size: 10, color: text });
    page.drawText("TOTAL:", { x: boxX + 12, y: boxY - 56, font: bold, size: 12, color: text });
    page.drawText(`RM ${fields.grand_total.toFixed(2)}`, { x: boxX + 108, y: boxY - 56, font: bold, size: 12, color: text });

    page.drawLine({
      start: { x: margin, y: 70 },
      end: { x: width - margin, y: 70 },
      thickness: 1,
      color: line,
    });
    page.drawText("Generated by LULUS AI | myinvois.hasil.gov.my", {
      x: margin,
      y: 52,
      font: regular,
      size: 8,
      color: soft,
    });
    page.drawText(
      "This invoice was auto-generated from OCR extraction. Please verify all details before official submission.",
      {
        x: margin,
        y: 38,
        font: regular,
        size: 8,
        color: soft,
      },
    );

    const pdfBytes = await pdfDoc.save();
    const invoiceNo = fields.invoice_number || `INV-${Date.now()}`;
    const date = new Date().toISOString().split("T")[0];
    const filename = `Invoice_${invoiceNo}_${date}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (error) {
    console.error("Invoice PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate invoice PDF." }, { status: 500 });
  }
}
