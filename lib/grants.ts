import type { BusinessProfile, GrantMatch } from "@/lib/types";

interface GrantRule {
  grant_name: string;
  grant_body: string;
  value_rm: number;
  apply_url: string;
  checks: Array<(profile: BusinessProfile) => boolean>;
}

const GRANT_RULES: GrantRule[] = [
  {
    grant_name: "SME Digitalisation Grant",
    grant_body: "MDEC",
    value_rm: 5000,
    apply_url: "https://mdec.my/",
    checks: [(p) => p.sells_online],
  },
  {
    grant_name: "DIPP",
    grant_body: "MDEC",
    value_rm: 50000,
    apply_url: "https://mdec.my/",
    checks: [(p) => p.type === "manufacturing" || /tech/i.test(p.product_type)],
  },
  {
    grant_name: "TEKUN Nasional",
    grant_body: "TEKUN",
    value_rm: 10000,
    apply_url: "https://www.tekun.gov.my/",
    checks: [(p) => Boolean(p.owner_bumiputera)],
  },
  {
    grant_name: "Cradle CIP Spark",
    grant_body: "Cradle",
    value_rm: 150000,
    apply_url: "https://cradle.com.my/",
    checks: [(p) => Boolean(p.is_tech_startup)],
  },
  {
    grant_name: "SME Corp BDD",
    grant_body: "SME Corp",
    value_rm: 5000,
    apply_url: "https://smecorp.gov.my/",
    checks: [(p) => p.employees > 0],
  },
];

/**
 * Matches grants by eligibility criteria and returns sorted descending by eligibility percentage.
 */
export function matchGrants(profile: BusinessProfile): GrantMatch[] {
  return GRANT_RULES.map((grant) => {
    const total = grant.checks.length;
    const met = grant.checks.filter((check) => check(profile)).length;
    return {
      grant_name: grant.grant_name,
      grant_body: grant.grant_body,
      value_rm: grant.value_rm,
      apply_url: grant.apply_url,
      eligibility_pct: Math.round((met / total) * 100),
    };
  }).sort((a, b) => b.eligibility_pct - a.eligibility_pct);
}