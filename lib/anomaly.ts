import type { Business, ExtractedDoc } from "@/lib/types";
import { getSupabaseAdmin, isSimulationMode } from "@/lib/supabase";

const expectedDurations: Record<string, number> = {
  "SSM Business Registration": 365,
  "JAKIM Halal Certification": 730,
  "Premises Business Licence": 365,
  "Signboard Permit": 365,
};

export interface AnomalyFlag {
  field: string;
  issue: string;
  severity: "warning" | "error";
}

/**
 * Detects profile/document mismatches and duplicate registration numbers.
 */
export async function detectAnomalies(extracted: ExtractedDoc, businessProfile: Business): Promise<AnomalyFlag[]> {
  const anomalies: AnomalyFlag[] = [];

  if (extracted.company_name && businessProfile.name) {
    const normalizedA = extracted.company_name.toLowerCase().trim();
    const normalizedB = businessProfile.name.toLowerCase().trim();
    if (normalizedA !== normalizedB) {
      anomalies.push({
        field: "company_name",
        issue: `Company name mismatch: ${extracted.company_name} vs ${businessProfile.name}`,
        severity: "warning",
      });
    }
  }

  if (extracted.issue_date && extracted.expiry_date) {
    const issue = new Date(extracted.issue_date);
    const expiry = new Date(extracted.expiry_date);
    const diffDays = Math.ceil((expiry.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24));
    const expected = expectedDurations[extracted.document_type];

    if (expected && diffDays < expected * 0.7) {
      anomalies.push({
        field: "expiry_date",
        issue: `Expiry looks too short for ${extracted.document_type}`,
        severity: "warning",
      });
    }
  }

  if (!isSimulationMode && extracted.reg_no) {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("documents")
        .select("id, extracted_data")
        .contains("extracted_data", { reg_no: extracted.reg_no });

      if (error) {
        console.warn("Duplicate check failed", error.message);
      }

      if (data && data.length > 0) {
        anomalies.push({
          field: "reg_no",
          issue: `Duplicate registration number found: ${extracted.reg_no}`,
          severity: "error",
        });
      }
    } catch (error) {
      console.warn("Duplicate lookup failed", error);
    }
  }

  return anomalies;
}