import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";
import { detectAnomalies, type AnomalyFlag } from "@/lib/anomaly";
import { getItemRisk, getOverallScore, getPenaltyExposure, type ComplianceItem } from "@/lib/risk";

type ExtractedData = {
  document_type: "SSM Certificate" | "LHDN Tax Receipt" | "LHDN SST Filing" | "LHDN e-Invoice" | "Unknown";
  company_name: string | null;
  reg_no: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  authority: "SSM" | "LHDN" | "Unknown";
  amount: number | null;
  invoice_no: string | null;
  supplier_name: string | null;
  supplier_tin: string | null;
  msic_code: string | null;
  total_amount: number | null;
  tax_amount: number | null;
};

type DbItemRow = {
  id: string;
  business_id: string;
  name: string;
  authority: string | null;
  deadline: string | null;
  renewal_cycle: string | null;
  status: string | null;
  risk_score: number | null;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "GRANT" | null;
  penalty_rm_min: number | null;
  penalty_rm_max: number | null;
  notes: string | null;
  document_uploaded: boolean | null;
  expiry_date: string | null;
  documents?: Array<{ id: string; expiry_date: string | null }> | null;
};

const OCR_PROMPT = `
You are a Malaysian business document OCR system.
Extract the following fields from this document as JSON only.
No explanation, no markdown, just raw JSON.

{
  "document_type": "SSM Certificate | LHDN Tax Receipt | LHDN SST Filing |
                    LHDN e-Invoice | Unknown",
  "company_name": "string or null",
  "reg_no": "string or null",
  "issue_date": "YYYY-MM-DD or null",
  "expiry_date": "YYYY-MM-DD or null",
  "authority": "SSM | LHDN | Unknown",
  "amount": "number or null",
  "invoice_no": "string or null",
  "supplier_name": "string or null",
  "supplier_tin": "string or null",
  "msic_code": "string or null",
  "total_amount": "number or null",
  "tax_amount": "number or null"
}

Rules:
- If field not found, use null
- For Malaysian receipts in BM, English, or Rojak — handle all
- document_type must be one of the exact values listed
- authority: if document_type contains SSM → "SSM", if LHDN → "LHDN"
`;

function sanitizeJson(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

function isSupportedMime(mime: string): boolean {
  return ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(mime.toLowerCase());
}

function normalizeExtracted(raw: Partial<ExtractedData>): ExtractedData {
  const documentType = raw.document_type ?? "Unknown";
  const authority =
    raw.authority ??
    (documentType.includes("SSM") ? "SSM" : documentType.includes("LHDN") ? "LHDN" : "Unknown");

  return {
    document_type:
      documentType === "SSM Certificate" ||
      documentType === "LHDN Tax Receipt" ||
      documentType === "LHDN SST Filing" ||
      documentType === "LHDN e-Invoice"
        ? documentType
        : "Unknown",
    company_name: raw.company_name ?? null,
    reg_no: raw.reg_no ?? null,
    issue_date: raw.issue_date ?? null,
    expiry_date: raw.expiry_date ?? null,
    authority: authority === "SSM" || authority === "LHDN" ? authority : "Unknown",
    amount: typeof raw.amount === "number" ? raw.amount : null,
    invoice_no: raw.invoice_no ?? null,
    supplier_name: raw.supplier_name ?? null,
    supplier_tin: raw.supplier_tin ?? null,
    msic_code: raw.msic_code ?? null,
    total_amount: typeof raw.total_amount === "number" ? raw.total_amount : null,
    tax_amount: typeof raw.tax_amount === "number" ? raw.tax_amount : null,
  };
}

function toRiskItem(row: DbItemRow): ComplianceItem {
  const doc = row.documents?.[0];
  return {
    id: row.id,
    business_id: row.business_id,
    name: row.name,
    authority: row.authority ?? "Unknown",
    deadline: row.deadline,
    renewal_cycle: row.renewal_cycle ?? "annual",
    status:
      row.status === "compliant" ||
      row.status === "uploaded" ||
      row.status === "pending" ||
      row.status === "expiring" ||
      row.status === "expired" ||
      row.status === "missing"
        ? row.status
        : "pending",
    risk_score: row.risk_score ?? 100,
    priority: row.priority === "CRITICAL" || row.priority === "HIGH" || row.priority === "MEDIUM" || row.priority === "GRANT" ? row.priority : "HIGH",
    penalty_rm_min: row.penalty_rm_min ?? 0,
    penalty_rm_max: row.penalty_rm_max ?? 0,
    notes: row.notes ?? undefined,
    document_uploaded: Boolean(row.document_uploaded) || Boolean(doc),
    expiry_date: doc?.expiry_date ?? row.expiry_date ?? null,
  };
}

async function getScoredItems(businessId: string): Promise<ComplianceItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("compliance_items")
    .select("*, documents(id, expiry_date)")
    .eq("business_id", businessId);
  if (error) throw error;

  return (data as DbItemRow[]).map((row) => {
    const riskItem = toRiskItem(row);
    return { ...riskItem, risk_score: getItemRisk(riskItem) };
  });
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 500 });
    }
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "GOOGLE_AI_API_KEY is missing." }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const businessId = String(formData.get("business_id") ?? formData.get("businessId") ?? "");

    if (!(file instanceof File) || !businessId) {
      return NextResponse.json({ error: "file and business_id are required" }, { status: 400 });
    }

    if (!isSupportedMime(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Use PDF, JPG, JPEG or PNG." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error: businessError } = await supabase.from("businesses").select("*").eq("id", businessId).single();
    if (businessError || !business) {
      return NextResponse.json({ error: businessError?.message ?? "Business not found" }, { status: 404 });
    }

    const oldItems = await getScoredItems(businessId);
    const oldScore = getOverallScore(oldItems);

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      { inlineData: { mimeType: file.type, data: base64Data } },
      OCR_PROMPT,
    ]);
    const text = result.response.text();
    const extracted = normalizeExtracted(JSON.parse(sanitizeJson(text)) as Partial<ExtractedData>);

    const anomalyFlags: AnomalyFlag[] = await detectAnomalies(extracted, business.name, supabase, businessId);

    const { data: matchedItem, error: matchError } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("business_id", businessId)
      .eq("authority", extracted.authority)
      .limit(1)
      .maybeSingle();

    if (matchError) {
      return NextResponse.json({ error: matchError.message }, { status: 500 });
    }

    const linkedItemId = matchedItem?.id ?? null;

    if (linkedItemId) {
      const expiry = extracted.expiry_date;
      const updateWithExpiry = await supabase
        .from("compliance_items")
        .update({
          document_uploaded: true,
          status: "uploaded",
          expiry_date: expiry,
          deadline: expiry ?? matchedItem.deadline,
        })
        .eq("id", linkedItemId);

      if (updateWithExpiry.error) {
        const fallbackUpdate = await supabase
          .from("compliance_items")
          .update({
            document_uploaded: true,
            status: "uploaded",
            deadline: expiry ?? matchedItem.deadline,
          })
          .eq("id", linkedItemId);
        if (fallbackUpdate.error) {
          return NextResponse.json({ error: fallbackUpdate.error.message }, { status: 500 });
        }
      }
    }

    const { data: insertedDoc, error: docError } = await supabase
      .from("documents")
      .insert({
        business_id: businessId,
        compliance_item_id: linkedItemId,
        filename: file.name,
        extracted_data: extracted,
        expiry_date: extracted.expiry_date,
        anomaly_flags: anomalyFlags,
      })
      .select("id")
      .single();

    if (docError || !insertedDoc) {
      return NextResponse.json({ error: docError?.message ?? "Failed to store document" }, { status: 500 });
    }

    const newItems = await getScoredItems(businessId);
    const newScore = getOverallScore(newItems);
    const penaltyExposure = getPenaltyExposure(newItems);

    await Promise.all(
      newItems.map((item) =>
        supabase
          .from("compliance_items")
          .update({
            risk_score: item.risk_score,
            status: item.document_uploaded ? "uploaded" : item.status,
          })
          .eq("id", item.id),
      ),
    );

    return NextResponse.json({
      success: true,
      document_id: insertedDoc.id,
      extracted_data: extracted,
      anomaly_flags: anomalyFlags,
      authority: extracted.authority,
      document_type: extracted.document_type,
      linked_item_id: linkedItemId,
      old_score: oldScore,
      new_score: newScore,
      score_dropped_by: Math.max(0, oldScore - newScore),
      penalty_exposure: penaltyExposure,
    });
  } catch (error) {
    console.error("/api/upload failed", error);
    return NextResponse.json({ error: "Upload processing failed" }, { status: 500 });
  }
}

