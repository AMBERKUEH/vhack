export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ItemStatus = "compliant" | "uploaded" | "pending" | "expiring" | "expired" | "missing";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "GRANT";

export interface ComplianceItem {
  id: string;
  business_id: string;
  name: string;
  authority: string;
  deadline: string | null;
  renewal_cycle: string;
  status: ItemStatus;
  risk_score: number;
  priority: Priority;
  penalty_rm_min: number;
  penalty_rm_max: number;
  notes?: string;
  document_uploaded?: boolean;
  expiry_date?: string | null;
}

export interface ForecastItem {
  item_id: string;
  item_name: string;
  authority: string;
  days_until_flip: number;
  current_risk: number;
  projected_risk: number;
  flip_date: string;
  priority: Priority;
}

export interface RiskData {
  overall_score: number;
  risk_level: RiskLevel;
  penalty_exposure: number;
  items_at_risk: number;
  next_deadline: {
    name: string;
    days_away: number;
    deadline: string;
  } | null;
  items: ComplianceItem[];
  forecast: ForecastItem[];
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function computeItemRiskAtDate(
  item: { document_uploaded?: boolean; expiry_date?: string | null; deadline?: string | null },
  baseDate: Date,
): number {
  if (!item.document_uploaded) return 100;

  const daysLeft = daysBetween(baseDate, item.expiry_date ?? item.deadline ?? null);

  if (daysLeft === null) return 80;
  if (daysLeft < 0) return 100;
  if (daysLeft < 14) return 95;
  if (daysLeft < 30) return 80;
  if (daysLeft < 90) return 50;
  if (daysLeft < 180) return 25;
  return 10;
}

/**
 * If toStr is null/undefined/empty or invalid date, returns null.
 */
export function daysBetween(from: Date, toStr: string | null | undefined): number | null {
  if (!toStr) return null;
  const to = new Date(toStr);
  if (Number.isNaN(to.getTime())) return null;
  return Math.floor((to.getTime() - from.getTime()) / 86400000);
}

/**
 * Calculates risk score (0-100) for a single compliance item.
 */
export function getItemRisk(item: {
  document_uploaded?: boolean;
  expiry_date?: string | null;
  deadline?: string | null;
}): number {
  return computeItemRiskAtDate(item, new Date());
}

/**
 * Converts numeric score to risk level.
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "LOW";
  if (score <= 60) return "MEDIUM";
  if (score <= 85) return "HIGH";
  return "CRITICAL";
}

/**
 * Weighted average score where CRITICAL=3x, HIGH=2x, MEDIUM=1x, GRANT=0x.
 */
export function getOverallScore(items: ComplianceItem[]): number {
  const WEIGHTS: Record<Priority, number> = {
    CRITICAL: 3,
    HIGH: 2,
    MEDIUM: 1,
    GRANT: 0,
  };

  const nonGrantItems = items.filter((item) => WEIGHTS[item.priority] > 0);
  if (nonGrantItems.length === 0) return 0;

  const totalWeight = nonGrantItems.reduce((sum, item) => sum + WEIGHTS[item.priority], 0);
  const weightedSum = nonGrantItems.reduce((sum, item) => sum + item.risk_score * WEIGHTS[item.priority], 0);

  return Math.round(weightedSum / totalWeight);
}

/**
 * Total RM penalty exposure for high-risk items.
 */
export function getPenaltyExposure(items: ComplianceItem[]): number {
  return items
    .filter((item) => getItemRisk(item) >= 80)
    .reduce((sum, item) => sum + item.penalty_rm_min, 0);
}

/**
 * Returns the most urgent upcoming deadline.
 */
export function getNextDeadline(items: ComplianceItem[]): RiskData["next_deadline"] {
  const today = new Date();

  const upcoming = items
    .filter((item) => {
      const days = daysBetween(today, item.deadline);
      return days !== null && days >= 0;
    })
    .sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime());

  const next = upcoming[0];
  if (!next || !next.deadline) return null;

  const daysAway = daysBetween(today, next.deadline);
  if (daysAway === null) return null;

  return {
    name: next.name,
    days_away: daysAway,
    deadline: next.deadline,
  };
}

/**
 * Projects items that will flip to HIGH risk (>=80) within 90 days.
 */
export function getForecast(items: ComplianceItem[]): ForecastItem[] {
  const checkpoints = [30, 60, 90];
  const now = new Date();
  const forecast: ForecastItem[] = [];

  for (const item of items) {
    if (item.priority === "GRANT") continue;

    const currentRisk = item.risk_score;
    if (currentRisk >= 80) continue;

    let chosenT: number | null = null;
    let projected = currentRisk;

    for (const t of checkpoints) {
      const futureDate = addDays(now, t);
      const simulatedRisk = computeItemRiskAtDate(item, futureDate);
      if (simulatedRisk >= 80) {
        chosenT = t;
        projected = simulatedRisk;
        break;
      }
    }

    if (chosenT !== null) {
      forecast.push({
        item_id: item.id,
        item_name: item.name,
        authority: item.authority,
        days_until_flip: chosenT,
        current_risk: currentRisk,
        projected_risk: projected,
        flip_date: addDays(now, chosenT).toISOString(),
        priority: item.priority,
      });
    }
  }

  return forecast.sort((a, b) => a.days_until_flip - b.days_until_flip).slice(0, 5);
}

/**
 * Builds full RiskData response payload.
 */
export function buildRiskData(items: ComplianceItem[]): RiskData {
  const overall_score = getOverallScore(items);
  return {
    overall_score,
    risk_level: getRiskLevel(overall_score),
    penalty_exposure: getPenaltyExposure(items),
    items_at_risk: items.filter((item) => getItemRisk(item) >= 50).length,
    next_deadline: getNextDeadline(items),
    items,
    forecast: getForecast(items),
  };
}

/**
 * Derives display status from upload + risk score.
 */
export function getStatusFromRisk(item: ComplianceItem): ItemStatus {
  if (!item.document_uploaded) return "missing";
  if (item.risk_score >= 100) return "expired";
  if (item.risk_score >= 80) return "expiring";
  if (item.risk_score >= 50) return "uploaded";
  return "compliant";
}

/**
 * Formats amount as Malaysian Ringgit.
 */
export function formatRM(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

/**
 * Returns semantic colour classes and hex by score.
 */
export function getRiskColour(score: number): {
  bg: string;
  text: string;
  border: string;
  hex: string;
} {
  if (score <= 30) {
    return {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
      hex: "#16a34a",
    };
  }

  if (score <= 60) {
    return {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-300",
      hex: "#d97706",
    };
  }

  if (score <= 85) {
    return {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
      hex: "#dc2626",
    };
  }

  return {
    bg: "bg-red-200",
    text: "text-red-900",
    border: "border-red-500",
    hex: "#991b1b",
  };
}
