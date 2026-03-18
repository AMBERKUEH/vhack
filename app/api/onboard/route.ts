import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { getRulesForBusiness } from "@/lib/compliance-rules";
import { matchGrants } from "@/lib/grants";
import { MOCK_BUSINESS, MOCK_GRANTS, MOCK_ITEMS } from "@/lib/mock";
import type { BusinessProfile } from "@/lib/types";

function plusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function deadlineFromCycle(cycle: string): string {
  if (cycle === "monthly") return plusDays(30);
  if (cycle === "bimonthly") return plusDays(60);
  if (cycle === "quarterly") return plusDays(90);
  if (cycle === "2 years") return plusDays(730);
  if (cycle === "one-time") return plusDays(3650);
  return plusDays(365);
}

const SIMULATED_PROFILE: BusinessProfile = {
  name: "Warung Mak Jah",
  type: "fnb",
  location: "Subang Jaya",
  state: "Selangor",
  employees: 3,
  sells_online: true,
  is_food: true,
  product_type: "halal food",
  channels: ["offline", "online"],
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { prompt: string; email: string };
    if (!body?.prompt || !body?.email) {
      return NextResponse.json({ error: "prompt and email are required" }, { status: 400 });
    }

    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({
        business: { ...MOCK_BUSINESS, owner_email: body.email, raw_prompt: body.prompt },
        compliance_items: MOCK_ITEMS,
        grant_matches: MOCK_GRANTS,
        simulated: true,
      });
    }

    let profile: BusinessProfile = SIMULATED_PROFILE;

    const openai = getOpenAIClient();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Extract business info as JSON with fields: name, type (fnb/retail/manufacturing/services/ecommerce), location, state, employees (number), sells_online (boolean), is_food (boolean), product_type. Return only valid JSON.",
            },
            { role: "user", content: body.prompt },
          ],
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as Partial<BusinessProfile>;
          profile = {
            name: parsed.name ?? SIMULATED_PROFILE.name,
            type: parsed.type ?? SIMULATED_PROFILE.type,
            location: parsed.location ?? SIMULATED_PROFILE.location,
            state: parsed.state ?? SIMULATED_PROFILE.state,
            employees: Number(parsed.employees ?? SIMULATED_PROFILE.employees),
            sells_online: Boolean(parsed.sells_online ?? SIMULATED_PROFILE.sells_online),
            is_food: Boolean(parsed.is_food ?? SIMULATED_PROFILE.is_food),
            product_type: parsed.product_type ?? SIMULATED_PROFILE.product_type,
            channels: [parsed.sells_online ? "online" : "offline"],
          };
        }
      } catch (error) {
        console.warn("OpenAI extraction failed", error);
      }
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: profile.name,
        type: profile.type,
        location: profile.location,
        state: profile.state,
        council: profile.location?.includes("Subang") ? "MBPJ" : "Unknown Council",
        employees: profile.employees,
        channels: profile.channels ?? [profile.sells_online ? "online" : "offline"],
        product_type: profile.product_type,
        raw_prompt: body.prompt,
        owner_email: body.email,
        language_pref: "en",
      })
      .select("*")
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: businessError?.message ?? "Failed to save business" }, { status: 500 });
    }

    const rules = getRulesForBusiness(profile);
    const rows = rules.map((rule) => ({
      business_id: business.id,
      name: rule.name,
      authority: rule.authority,
      deadline: deadlineFromCycle(rule.renewal_cycle),
      renewal_cycle: rule.renewal_cycle,
      status: "pending",
      risk_score: 100,
      priority: rule.priority,
      penalty_rm_min: rule.penalty_rm_min,
      penalty_rm_max: rule.penalty_rm_max,
      notes: null,
    }));

    const { data: complianceItems, error: itemsError } = await supabase.from("compliance_items").insert(rows).select("*");
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const grants = matchGrants({ ...profile, owner_bumiputera: false, is_tech_startup: false });
    const { data: grantRows, error: grantsError } = await supabase
      .from("grant_matches")
      .insert(
        grants.map((g) => ({
          business_id: business.id,
          grant_name: g.grant_name,
          grant_body: g.grant_body,
          value_rm: g.value_rm,
          eligibility_pct: g.eligibility_pct,
          apply_url: g.apply_url,
        })),
      )
      .select("*");

    if (grantsError) {
      return NextResponse.json({ error: grantsError.message }, { status: 500 });
    }

    return NextResponse.json({ business, compliance_items: complianceItems ?? [], grant_matches: grantRows ?? [], simulated: false });
  } catch (error) {
    console.error("/api/onboard failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}