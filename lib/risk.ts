export type ItemPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "GRANT";

export interface ComplianceItem {
  id?: string;
  name: string;
  priority: ItemPriority;
  penalty_rm_min: number;
  risk_score?: number;
  document_uploaded?: boolean;
  expiry_date?: string | null;
}

export interface ForecastItem {
  name: string;
  days_until_flip: number;
  projected_risk: number;
  milestone: "T+30" | "T+60" | "T+90";
}

/**
 * Computes item-level risk based on document presence and expiry horizon.
 */
export function getItemRisk(item: { document_uploaded: boolean; expiry_date: string | null }): number {
  if (!item.document_uploaded || !item.expiry_date) {
    return 100;
  }

  const expiry = new Date(item.expiry_date);
  if (Number.isNaN(expiry.getTime())) {
    return 100;
  }

  const now = new Date();
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 100;
  if (diffDays < 14) return 95;
  if (diffDays < 30) return 80;
  if (diffDays < 90) return 50;
  if (diffDays < 180) return 25;
  return 10;
}

/**
 * Computes weighted overall compliance score.
 */
export function getOverallScore(items: ComplianceItem[]): number {
  if (items.length === 0) {
    return 0;
  }

  const weightMap: Record<ItemPriority, number> = {
    CRITICAL: 3,
    HIGH: 2,
    MEDIUM: 1,
    GRANT: 0,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const item of items) {
    const weight = weightMap[item.priority] ?? 1;
    if (weight === 0) continue;

    const risk = item.risk_score ?? getItemRisk({
      document_uploaded: Boolean(item.document_uploaded),
      expiry_date: item.expiry_date ?? null,
    });

    weightedSum += risk * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(weightedSum / totalWeight);
}

/**
 * Sums minimum penalty exposure for items currently high-risk.
 */
export function getPenaltyExposure(items: ComplianceItem[]): number {
  return items.reduce((sum, item) => {
    const risk = item.risk_score ?? getItemRisk({
      document_uploaded: Boolean(item.document_uploaded),
      expiry_date: item.expiry_date ?? null,
    });

    return risk >= 80 ? sum + (item.penalty_rm_min ?? 0) : sum;
  }, 0);
}

function riskAtOffsetDays(expiryDate: string | null | undefined, offsetDays: number): number {
  if (!expiryDate) return 100;
  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return 100;

  const future = new Date();
  future.setDate(future.getDate() + offsetDays);
  const diffDays = Math.ceil((expiry.getTime() - future.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 100;
  if (diffDays < 14) return 95;
  if (diffDays < 30) return 80;
  if (diffDays < 90) return 50;
  if (diffDays < 180) return 25;
  return 10;
}

/**
 * Projects near-term flips to HIGH risk (>=80) within 90 days.
 */
export function getForecast(items: ComplianceItem[]): ForecastItem[] {
  const milestones: Array<{ days: number; label: ForecastItem["milestone"] }> = [
    { days: 30, label: "T+30" },
    { days: 60, label: "T+60" },
    { days: 90, label: "T+90" },
  ];

  const forecast: ForecastItem[] = [];

  for (const item of items) {
    const currentRisk = item.risk_score ?? getItemRisk({
      document_uploaded: Boolean(item.document_uploaded),
      expiry_date: item.expiry_date ?? null,
    });

    for (const milestone of milestones) {
      const projected = riskAtOffsetDays(item.expiry_date ?? null, milestone.days);
      const flipsToHigh = currentRisk < 80 && projected >= 80;

      if (flipsToHigh) {
        forecast.push({
          name: item.name,
          days_until_flip: milestone.days,
          projected_risk: projected,
          milestone: milestone.label,
        });
        break;
      }
    }
  }

  return forecast.sort((a, b) => a.days_until_flip - b.days_until_flip);
}