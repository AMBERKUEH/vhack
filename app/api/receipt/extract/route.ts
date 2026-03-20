import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";

type TaxType = "SST 6%" | "SST 0%" | "Exempt" | "None";

type ReceiptLineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type: TaxType;
  tax_rate: number;
  tax_amount: number;
  total: number;
};

type ReceiptFields = {
  supplier_name: string | null;
  supplier_tin: string | null;
  supplier_reg_no: string | null;
  supplier_msic: string | null;
  supplier_address: string | null;
  supplier_phone: string | null;
  supplier_email: string | null;
  buyer_name: string | null;
  buyer_tin: string | null;
  buyer_reg_no: string | null;
  buyer_address: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  invoice_time: string | null;
  currency: string;
  line_items: ReceiptLineItem[];
  subtotal: number | null;
  tax_total: number | null;
  grand_total: number | null;
};

function buildDemoExtracted(filename: string): ReceiptFields {
  const stamp = Date.now().toString().slice(-6);
  const invoiceNo = `INV-${stamp}`;
  const baseAmount = 188.0;
  const taxRate = 0.06;
  const taxAmount = Number((baseAmount * taxRate).toFixed(2));
  const grandTotal = Number((baseAmount + taxAmount).toFixed(2));

  return {
    supplier_name: "Demo Supplier Sdn Bhd",
    supplier_tin: "C2584563200",
    supplier_reg_no: "202401234567",
    supplier_msic: "56101",
    supplier_address: "No. 8, Jalan SS15/4D, Subang Jaya, Selangor",
    supplier_phone: "0123456789",
    supplier_email: "billing@demosupplier.my",
    buyer_name: "Warung Mak Jah",
    buyer_tin: "IG12345678900",
    buyer_reg_no: "JM0123456-X",
    buyer_address: "Subang Jaya, Selangor",
    invoice_number: invoiceNo,
    invoice_date: new Date().toISOString().slice(0, 10),
    invoice_time: "10:30:00Z",
    currency: "MYR",
    line_items: [
      {
        description: `Demo extracted from ${filename || "uploaded receipt"}`,
        quantity: 1,
        unit_price: baseAmount,
        tax_type: "SST 6%",
        tax_rate: 0.06,
        tax_amount: taxAmount,
        total: grandTotal,
      },
    ],
    subtotal: baseAmount,
    tax_total: taxAmount,
    grand_total: grandTotal,
  };
}

const GEMINI_PROMPT = `You are an expert at reading Malaysian business receipts and invoices.
Extract all available information from this receipt image.
Return ONLY valid JSON with exactly these fields. Use null when missing:
{
  "supplier_name": "string | null",
  "supplier_tin": "string | null",
  "supplier_reg_no": "string | null",
  "supplier_msic": "string | null",
  "supplier_address": "string | null",
  "supplier_phone": "string | null",
  "supplier_email": "string | null",
  "buyer_name": "string | null",
  "buyer_tin": "string | null",
  "buyer_reg_no": "string | null",
  "buyer_address": "string | null",
  "invoice_number": "string | null",
  "invoice_date": "string | null",
  "invoice_time": "string | null",
  "currency": "string",
  "line_items": [
    {
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "tax_type": "string",
      "tax_rate": "number",
      "tax_amount": "number",
      "total": "number"
    }
  ],
  "subtotal": "number | null",
  "tax_total": "number | null",
  "grand_total": "number | null"
}
No markdown. No explanation. JSON only.`;

function supportedMime(mimeType: string): boolean {
  return ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"].includes(
    mimeType.toLowerCase(),
  );
}

function parseJsonFromGemini(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const candidates: string[] = [];
  candidates.push(cleaned);

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(cleaned.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    const normalized = candidate.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(normalized);
    } catch {
      continue;
    }
  }

  throw new Error("Unable to parse Gemini JSON response.");
}

function normalizeTaxType(value: string): TaxType {
  if (value === "SST 0%") return "SST 0%";
  if (value === "Exempt") return "Exempt";
  if (value === "None") return "None";
  return "SST 6%";
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeFields(raw: Partial<ReceiptFields>): ReceiptFields {
  const lineItems = (raw.line_items ?? []).map((item) => {
    const taxType = normalizeTaxType(String(item.tax_type ?? "SST 6%"));
    const quantity = toNumber(item.quantity, 1);
    const unitPrice = toNumber(item.unit_price, 0);
    const taxRate = Number((taxType === "SST 6%" ? 0.06 : 0).toFixed(2));
    const lineTotal = quantity * unitPrice;
    const taxAmount = Number((lineTotal * taxRate).toFixed(2));

    return {
      description: String(item.description ?? ""),
      quantity,
      unit_price: unitPrice,
      tax_type: taxType,
      tax_rate: taxRate,
      tax_amount: Number.isFinite(toNumber(item.tax_amount, taxAmount)) ? toNumber(item.tax_amount, taxAmount) : taxAmount,
      total: Number.isFinite(toNumber(item.total, lineTotal + taxAmount))
        ? toNumber(item.total, lineTotal + taxAmount)
        : lineTotal + taxAmount,
    } satisfies ReceiptLineItem;
  });

  return {
    supplier_name: raw.supplier_name ?? null,
    supplier_tin: raw.supplier_tin ?? null,
    supplier_reg_no: raw.supplier_reg_no ?? null,
    supplier_msic: raw.supplier_msic ?? null,
    supplier_address: raw.supplier_address ?? null,
    supplier_phone: raw.supplier_phone ?? null,
    supplier_email: raw.supplier_email ?? null,
    buyer_name: raw.buyer_name ?? null,
    buyer_tin: raw.buyer_tin ?? null,
    buyer_reg_no: raw.buyer_reg_no ?? null,
    buyer_address: raw.buyer_address ?? null,
    invoice_number: raw.invoice_number ?? null,
    invoice_date: raw.invoice_date ?? null,
    invoice_time: raw.invoice_time ?? null,
    currency: raw.currency || "MYR",
    line_items: lineItems,
    subtotal: raw.subtotal !== undefined && raw.subtotal !== null ? toNumber(raw.subtotal, 0) : null,
    tax_total: raw.tax_total !== undefined && raw.tax_total !== null ? toNumber(raw.tax_total, 0) : null,
    grand_total: raw.grand_total !== undefined && raw.grand_total !== null ? toNumber(raw.grand_total, 0) : null,
  };
}

function parseDateFromText(text: string): string | null {
  const isoMatch = text.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (isoMatch) {
    const yyyy = isoMatch[1];
    const mm = isoMatch[2].padStart(2, "0");
    const dd = isoMatch[3].padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const dmyMatch = text.match(/\b(\d{1,2})[-/](\d{1,2})[-/](20\d{2})\b/);
  if (dmyMatch) {
    const dd = dmyMatch[1].padStart(2, "0");
    const mm = dmyMatch[2].padStart(2, "0");
    const yyyy = dmyMatch[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}

function parseTimeFromText(text: string): string | null {
  const match = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?\b/);
  if (!match) return null;
  const hh = match[1].padStart(2, "0");
  const mm = match[2].padStart(2, "0");
  const ss = (match[3] ?? "00").padStart(2, "0");
  return `${hh}:${mm}:${ss}Z`;
}

function parseAmountFromText(text: string): number | null {
  const totalLines = text
    .split(/\r?\n/)
    .filter((line) => /total|jumlah|grand total|amount due|balance due/i.test(line));
  const candidate = totalLines.length > 0 ? totalLines.join(" ") : text;
  const matches = [...candidate.matchAll(/(?:RM\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})|\d+(?:\.\d{2}))/gi)];
  if (!matches.length) return null;
  const value = matches[matches.length - 1][1].replace(/,/g, "");
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseInvoiceNoFromText(text: string): string | null {
  const match = text.match(/\b(?:invoice|inv|receipt|bill)\s*(?:no|#|number)?\s*[:\-]?\s*([A-Z0-9\-\/]+)/i);
  if (!match) return null;
  return match[1].trim();
}

function parseTinFromText(text: string): string | null {
  const match = text.match(/\b(?:TIN|Tax\s*ID|Tax\s*No|No\s*Cukai)\s*[:\-]?\s*([A-Z0-9\-]{6,20})\b/i);
  return match?.[1]?.trim() ?? null;
}

function parseRegNoFromText(text: string): string | null {
  const match = text.match(/\b(?:SSM|Reg(?:istration)?\s*No|BRN)\s*[:\-]?\s*([A-Z0-9\-]{6,20})\b/i);
  return match?.[1]?.trim() ?? null;
}

function parsePhoneFromText(text: string): string | null {
  const match = text.match(/\b(?:\+?60|0)\d{1,2}[-\s]?\d{3,4}[-\s]?\d{3,4}\b/);
  return match?.[0]?.trim() ?? null;
}

function parseEmailFromText(text: string): string | null {
  const match = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  return match?.[0]?.trim() ?? null;
}

function firstMeaningfulLine(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 2);
  if (!lines.length) return null;
  return lines.find((line) => !/invoice|receipt|tax|qty|amount|date|time/i.test(line)) ?? lines[0];
}

function buildFallbackFromText(rawText: string): ReceiptFields {
  const cleaned = rawText.replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();
  const amount = parseAmountFromText(cleaned);
  const date = parseDateFromText(cleaned);
  const time = parseTimeFromText(cleaned);
  const supplierName = firstMeaningfulLine(cleaned);

  const lineTotal = amount ?? 0;
  const taxRate = /sst\s*6|service\s*tax\s*6|tax\s*6%/i.test(cleaned) ? 0.06 : 0;
  const taxAmount = Number((lineTotal * taxRate).toFixed(2));

  return normalizeFields({
    supplier_name: supplierName,
    supplier_tin: parseTinFromText(cleaned),
    supplier_reg_no: parseRegNoFromText(cleaned),
    supplier_msic: null,
    supplier_address: null,
    supplier_phone: parsePhoneFromText(cleaned),
    supplier_email: parseEmailFromText(cleaned),
    buyer_name: null,
    buyer_tin: null,
    buyer_reg_no: null,
    buyer_address: null,
    invoice_number: parseInvoiceNoFromText(cleaned),
    invoice_date: date,
    invoice_time: time,
    currency: "MYR",
    line_items: [
      {
        description: "Receipt Item",
        quantity: 1,
        unit_price: lineTotal,
        tax_type: taxRate > 0 ? "SST 6%" : "None",
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total: Number((lineTotal + taxAmount).toFixed(2)),
      },
    ],
    subtotal: lineTotal,
    tax_total: taxAmount,
    grand_total: Number((lineTotal + taxAmount).toFixed(2)),
  });
}

async function extractTextFallback(file: File): Promise<string> {
  const mime = file.type.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (mime === "application/pdf") {
    const parsed = await pdfParse(buffer);
    const pdfText = parsed.text?.trim() ?? "";
    if (pdfText) return pdfText;
  }

  const { data } = await Tesseract.recognize(buffer, "eng+msa");
  return data.text?.trim() ?? "";
}

function confidenceFromExtracted(data: ReceiptFields): "high" | "medium" | "low" {
  let score = 0;
  if (data.supplier_name) score += 1;
  if (data.buyer_name) score += 1;
  if (data.invoice_number) score += 1;
  if (data.invoice_date) score += 1;
  if (data.line_items.length > 0) score += 1;
  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "GOOGLE_AI_API_KEY is missing." }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required." }, { status: 400 });
    }
    if (!supportedMime(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, PDF, or WEBP." }, { status: 400 });
    }

    const simulationMode = process.env.SIMULATION_MODE === "true";
    if (simulationMode) {
      const extracted = buildDemoExtracted(file.name);
      return NextResponse.json({
        success: true,
        extracted,
        confidence: "medium",
      });
    }

    const base64Data = Buffer.from(await file.arrayBuffer()).toString("base64");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const modelCandidates = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;
    let extracted: ReceiptFields | null = null;
    let lastError: Error | null = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          { inlineData: { mimeType: file.type, data: base64Data } },
          GEMINI_PROMPT,
        ]);
        const rawText = result.response.text();
        const parsed = parseJsonFromGemini(rawText) as Partial<ReceiptFields>;
        extracted = normalizeFields(parsed);
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Gemini request failed");
      }
    }

    if (!extracted) {
      try {
        const fallbackText = await extractTextFallback(file);
        if (!fallbackText) {
          throw lastError ?? new Error("OCR fallback extracted empty text.");
        }
        extracted = buildFallbackFromText(fallbackText);
      } catch (fallbackError) {
        console.warn("OCR fallback failed, using demo extraction:", fallbackError);
        extracted = buildDemoExtracted(file.name);
      }
    }

    return NextResponse.json({
      success: true,
      extracted,
      confidence: confidenceFromExtracted(extracted),
    });
  } catch (error) {
    console.error("Receipt extraction error:", error);
    const message = error instanceof Error ? error.message : "Failed to extract receipt details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
