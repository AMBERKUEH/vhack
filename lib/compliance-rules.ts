export type BusinessType = "fnb" | "retail" | "manufacturing" | "services" | "ecommerce";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "GRANT";

export interface BusinessProfileInput {
  name: string;
  type: BusinessType;
  employees: number;
  is_food: boolean;
  sells_online: boolean;
  product_type?: string;
}

export interface ComplianceRule {
  name: string;
  authority: string;
  renewal_cycle: "monthly" | "bimonthly" | "quarterly" | "annual" | "2 years" | "one-time";
  penalty_rm_min: number;
  penalty_rm_max: number;
  priority: Priority;
  halal_required?: boolean;
  min_employees?: number;
  online_only?: boolean;
}

/**
 * Rulebook for Malaysian SME compliance requirements by business type.
 */
export const COMPLIANCE_RULES: Record<BusinessType, ComplianceRule[]> = {
  fnb: [
    {
      name: "SSM Business Registration",
      authority: "SSM",
      renewal_cycle: "annual",
      penalty_rm_min: 50000,
      penalty_rm_max: 50000,
      priority: "CRITICAL",
    },
    {
      name: "SST Registration & Filing",
      authority: "LHDN",
      renewal_cycle: "bimonthly",
      penalty_rm_min: 10000,
      penalty_rm_max: 50000,
      priority: "HIGH",
    },
    {
      name: "JAKIM Halal Certification",
      authority: "JAKIM",
      renewal_cycle: "2 years",
      penalty_rm_min: 0,
      penalty_rm_max: 0,
      priority: "HIGH",
      halal_required: true,
    },
    {
      name: "Premises Business Licence",
      authority: "Local Council",
      renewal_cycle: "annual",
      penalty_rm_min: 2000,
      penalty_rm_max: 10000,
      priority: "HIGH",
    },
    {
      name: "Signboard Permit",
      authority: "Local Council",
      renewal_cycle: "annual",
      penalty_rm_min: 500,
      penalty_rm_max: 2000,
      priority: "MEDIUM",
    },
    {
      name: "EPF + SOCSO Monthly",
      authority: "KWSP/PERKESO",
      renewal_cycle: "monthly",
      penalty_rm_min: 200,
      penalty_rm_max: 2000,
      priority: "HIGH",
      min_employees: 1,
    },
    {
      name: "MDEC e-Commerce Reg",
      authority: "MDEC",
      renewal_cycle: "one-time",
      penalty_rm_min: 0,
      penalty_rm_max: 0,
      priority: "MEDIUM",
      online_only: true,
    },
  ],
  retail: [
    {
      name: "SSM Business Registration",
      authority: "SSM",
      renewal_cycle: "annual",
      penalty_rm_min: 50000,
      penalty_rm_max: 50000,
      priority: "CRITICAL",
    },
    {
      name: "Sales & Service Tax Filing",
      authority: "LHDN",
      renewal_cycle: "bimonthly",
      penalty_rm_min: 5000,
      penalty_rm_max: 30000,
      priority: "HIGH",
    },
    {
      name: "Premises Business Licence",
      authority: "Local Council",
      renewal_cycle: "annual",
      penalty_rm_min: 2000,
      penalty_rm_max: 10000,
      priority: "HIGH",
    },
    {
      name: "Signboard Permit",
      authority: "Local Council",
      renewal_cycle: "annual",
      penalty_rm_min: 500,
      penalty_rm_max: 2000,
      priority: "MEDIUM",
    },
    {
      name: "EPF + SOCSO Monthly",
      authority: "KWSP/PERKESO",
      renewal_cycle: "monthly",
      penalty_rm_min: 200,
      penalty_rm_max: 2000,
      priority: "HIGH",
      min_employees: 1,
    },
    {
      name: "MDEC e-Commerce Reg",
      authority: "MDEC",
      renewal_cycle: "one-time",
      penalty_rm_min: 0,
      penalty_rm_max: 0,
      priority: "MEDIUM",
      online_only: true,
    },
  ],
  manufacturing: [
    {
      name: "SSM Business Registration",
      authority: "SSM",
      renewal_cycle: "annual",
      penalty_rm_min: 50000,
      penalty_rm_max: 50000,
      priority: "CRITICAL",
    },
    {
      name: "MITI Manufacturing License",
      authority: "MITI",
      renewal_cycle: "annual",
      penalty_rm_min: 10000,
      penalty_rm_max: 100000,
      priority: "CRITICAL",
    },
    {
      name: "DOSH Safety Compliance",
      authority: "DOSH",
      renewal_cycle: "annual",
      penalty_rm_min: 5000,
      penalty_rm_max: 50000,
      priority: "HIGH",
    },
    {
      name: "EPF + SOCSO Monthly",
      authority: "KWSP/PERKESO",
      renewal_cycle: "monthly",
      penalty_rm_min: 200,
      penalty_rm_max: 2000,
      priority: "HIGH",
      min_employees: 1,
    },
    {
      name: "HRDF Levy Filing",
      authority: "HRD Corp",
      renewal_cycle: "monthly",
      penalty_rm_min: 500,
      penalty_rm_max: 5000,
      priority: "MEDIUM",
      min_employees: 10,
    },
  ],
  services: [
    {
      name: "SSM Business Registration",
      authority: "SSM",
      renewal_cycle: "annual",
      penalty_rm_min: 50000,
      penalty_rm_max: 50000,
      priority: "CRITICAL",
    },
    {
      name: "Professional License Renewal",
      authority: "Relevant Board",
      renewal_cycle: "annual",
      penalty_rm_min: 1000,
      penalty_rm_max: 10000,
      priority: "HIGH",
    },
    {
      name: "Tax Estimate Filing (CP204)",
      authority: "LHDN",
      renewal_cycle: "annual",
      penalty_rm_min: 500,
      penalty_rm_max: 20000,
      priority: "HIGH",
    },
    {
      name: "EPF + SOCSO Monthly",
      authority: "KWSP/PERKESO",
      renewal_cycle: "monthly",
      penalty_rm_min: 200,
      penalty_rm_max: 2000,
      priority: "HIGH",
      min_employees: 1,
    },
  ],
  ecommerce: [
    {
      name: "SSM Business Registration",
      authority: "SSM",
      renewal_cycle: "annual",
      penalty_rm_min: 50000,
      penalty_rm_max: 50000,
      priority: "CRITICAL",
    },
    {
      name: "MDEC e-Commerce Reg",
      authority: "MDEC",
      renewal_cycle: "one-time",
      penalty_rm_min: 0,
      penalty_rm_max: 0,
      priority: "HIGH",
      online_only: true,
    },
    {
      name: "PDPA Compliance",
      authority: "PDP Department",
      renewal_cycle: "annual",
      penalty_rm_min: 5000,
      penalty_rm_max: 30000,
      priority: "HIGH",
    },
    {
      name: "SST Registration & Filing",
      authority: "LHDN",
      renewal_cycle: "bimonthly",
      penalty_rm_min: 5000,
      penalty_rm_max: 30000,
      priority: "HIGH",
    },
  ],
};

/**
 * Returns applicable rules for a business profile based on employees, food, and online flags.
 */
export function getRulesForBusiness(profile: BusinessProfileInput): ComplianceRule[] {
  const baseRules = COMPLIANCE_RULES[profile.type] ?? [];

  return baseRules.filter((rule) => {
    if (rule.min_employees !== undefined && profile.employees < rule.min_employees) {
      return false;
    }

    if (rule.halal_required && !profile.is_food) {
      return false;
    }

    if (rule.online_only && !profile.sells_online) {
      return false;
    }

    return true;
  });
}