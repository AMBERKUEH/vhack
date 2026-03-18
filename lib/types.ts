export type BusinessType = "fnb" | "retail" | "manufacturing" | "services" | "ecommerce";
export type LanguagePref = "en" | "bm";

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  location: string | null;
  state: string | null;
  council: string | null;
  employees: number;
  channels: string[] | null;
  product_type: string | null;
  raw_prompt: string | null;
  owner_email: string;
  language_pref: LanguagePref;
  phone?: string | null;
}

export interface ComplianceItem {
  id: string;
  business_id: string;
  name: string;
  authority: string | null;
  deadline: string | null;
  renewal_cycle: string | null;
  status: string;
  risk_score: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "GRANT";
  penalty_rm_min: number;
  penalty_rm_max: number;
  notes: string | null;
  document_uploaded?: boolean;
  expiry_date?: string | null;
}

export interface ForecastItem {
  name: string;
  days_until_flip: number;
  projected_risk: number;
  milestone: "T+30" | "T+60" | "T+90";
}

export interface ExtractedDoc {
  document_type: string;
  company_name: string;
  reg_no: string;
  issue_date: string | null;
  expiry_date: string | null;
  issuing_authority: string;
  amount: number | null;
}

export interface ChunkResult {
  id?: string;
  source: string;
  doc_title: string;
  page_ref: string;
  content: string;
  similarity: number;
}

export interface GrantMatch {
  grant_name: string;
  grant_body: string;
  value_rm: number;
  eligibility_pct: number;
  apply_url: string;
}

export interface BusinessProfile {
  name: string;
  type: BusinessType;
  location: string;
  state: string;
  employees: number;
  sells_online: boolean;
  is_food: boolean;
  product_type: string;
  channels?: string[];
  owner_bumiputera?: boolean;
  is_tech_startup?: boolean;
}

export interface FormField {
  id: string;
  label: string;
  label_bm: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  value?: string;
  required: boolean;
}