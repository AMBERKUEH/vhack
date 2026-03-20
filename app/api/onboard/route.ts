import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv } from "@/lib/supabase";
import { getRulesForBusiness } from "@/lib/compliance-rules";
import { matchGrants } from "@/lib/grants";
import type { BusinessProfile } from "@/lib/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

async function extractBusinessProfile(prompt: string): Promise<Partial<BusinessProfile> | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Extract business info as JSON with fields: name, type (fnb/retail/manufacturing/services/ecommerce), location, state, employees (number), sells_online (boolean), is_food (boolean), product_type. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.warn("Groq extraction failed:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      return JSON.parse(content) as Partial<BusinessProfile>;
    }
  } catch (error) {
    console.warn("Business extraction failed:", error);
  }
  return null;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { prompt: string; email: string };
    if (!body?.prompt || !body?.email) {
      return NextResponse.json({ error: "prompt and email are required" }, { status: 400 });
    }

    if (!hasSupabaseEnv) {
      return NextResponse.json({ error: "Supabase environment is missing" }, { status: 500 });
    }

    let profile: BusinessProfile = {
      name: "New Business",
      type: "services",
      location: "Malaysia",
      state: "Unknown",
      employees: 0,
      sells_online: false,
      is_food: false,
      product_type: "general",
      channels: ["offline"],
    };

    const extracted = await extractBusinessProfile(body.prompt);
    if (extracted) {
      profile = {
        name: extracted.name ?? profile.name,
        type: extracted.type ?? profile.type,
        location: extracted.location ?? profile.location,
        state: extracted.state ?? profile.state,
        employees: Number(extracted.employees ?? profile.employees),
        sells_online: Boolean(extracted.sells_online ?? profile.sells_online),
        is_food: Boolean(extracted.is_food ?? profile.is_food),
        product_type: extracted.product_type ?? profile.product_type,
        channels: [extracted.sells_online ? "online" : "offline"],
      };
    }

    const supabase = getSupabaseAdmin();

    const { data: existingBusiness, error: existingBusinessError } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_email", body.email)
      .maybeSingle();

    if (existingBusinessError) {
      return NextResponse.json({ error: existingBusinessError.message }, { status: 500 });
    }

    let business = existingBusiness;

    if (business) {
      const { data: updated, error: updateError } = await supabase
        .from("businesses")
        .update({
          name: profile.name,
          type: profile.type,
          location: profile.location,
          state: profile.state,
          council: profile.location?.includes("Subang") ? "MBPJ" : "Unknown Council",
          employees: profile.employees,
          channels: profile.channels ?? [profile.sells_online ? "online" : "offline"],
          product_type: profile.product_type,
          raw_prompt: body.prompt,
          language_pref: "en",
        })
        .eq("id", business.id)
        .select("*")
        .single();

      if (updateError || !updated) {
        return NextResponse.json({ error: updateError?.message ?? "Failed to update business" }, { status: 500 });
      }
      business = updated;
    } else {
      const { data: inserted, error: insertError } = await supabase
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

      if (insertError || !inserted) {
        return NextResponse.json({ error: insertError?.message ?? "Failed to save business" }, { status: 500 });
      }
      business = inserted;
    }

    const { data: existingItems, error: existingItemsError } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("business_id", business.id);

    if (existingItemsError) {
      return NextResponse.json({ error: existingItemsError.message }, { status: 500 });
    }

    let complianceItems = existingItems ?? [];
    if (!complianceItems.length) {
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

      const { data: insertedItems, error: itemsError } = await supabase.from("compliance_items").insert(rows).select("*");
      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }
      complianceItems = insertedItems ?? [];
    }

    const { data: existingGrants, error: existingGrantsError } = await supabase
      .from("grant_matches")
      .select("*")
      .eq("business_id", business.id)
      .order("eligibility_pct", { ascending: false });

    if (existingGrantsError) {
      return NextResponse.json({ error: existingGrantsError.message }, { status: 500 });
    }

    let grantRows = existingGrants ?? [];
    if (!grantRows.length) {
      const grants = matchGrants({ ...profile, owner_bumiputera: false, is_tech_startup: false });
      const { data: insertedGrants, error: grantsError } = await supabase
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
      grantRows = insertedGrants ?? [];
    }

    return NextResponse.json({ business, compliance_items: complianceItems, grant_matches: grantRows, simulated: false });
  } catch (error) {
    console.error("/api/onboard failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
