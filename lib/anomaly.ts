import type { SupabaseClient } from "@supabase/supabase-js";

export interface AnomalyFlag {
  code: string;
  message: string;
  severity: "warning" | "error";
}

interface ExtractedLike {
  document_type?: string | null;
  company_name?: string | null;
  reg_no?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
}

/**
 * Detect anomalies from OCR output against business profile and prior uploads.
 */
export async function detectAnomalies(
  extracted: ExtractedLike,
  businessName: string,
  supabase: SupabaseClient,
  businessId: string,
): Promise<AnomalyFlag[]> {
  const flags: AnomalyFlag[] = [];

  if (extracted.company_name && businessName) {
    const a = extracted.company_name.toLowerCase().trim();
    const b = businessName.toLowerCase().trim();
    const similarity = a === b ? 1 : a.includes(b) || b.includes(a) ? 0.9 : 0.5;
    if (similarity < 0.7) {
      flags.push({
        code: "NAME_MISMATCH",
        message: `Document name "${extracted.company_name}" does not match business name "${businessName}"`,
        severity: "warning",
      });
    }
  }

  if (extracted.expiry_date) {
    const expiry = new Date(extracted.expiry_date);
    if (!Number.isNaN(expiry.getTime()) && expiry < new Date()) {
      flags.push({
        code: "ALREADY_EXPIRED",
        message: `Document expired on ${extracted.expiry_date}`,
        severity: "error",
      });
    }
  }

  if (extracted.issue_date && extracted.expiry_date) {
    const issue = new Date(extracted.issue_date);
    const expiry = new Date(extracted.expiry_date);
    if (!Number.isNaN(issue.getTime()) && !Number.isNaN(expiry.getTime())) {
      const days = Math.floor((expiry.getTime() - issue.getTime()) / 86400000);
      if (days > 0 && days < 90) {
        flags.push({
          code: "SHORT_EXPIRY",
          message: "Document validity period looks unusually short",
          severity: "warning",
        });
      }
    }
  }

  if ((extracted.document_type ?? "Unknown") === "Unknown") {
    flags.push({
      code: "UNRECOGNISED_DOC",
      message: "Document type could not be determined",
      severity: "warning",
    });
  }

  if (extracted.reg_no) {
    const { data: existing } = await supabase
      .from("documents")
      .select("id")
      .eq("business_id", businessId)
      .contains("extracted_data", { reg_no: extracted.reg_no })
      .limit(1);

    if (existing && existing.length > 0) {
      flags.push({
        code: "DUPLICATE",
        message: "A document with this registration number already exists",
        severity: "warning",
      });
    }
  }

  return flags;
}
