import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { getRulesForBusiness } from "../lib/compliance-rules";

type DbBusiness = {
  id: string;
  name: string;
  type: "fnb" | "retail" | "manufacturing" | "services" | "ecommerce";
  location: string;
  state: string;
  council: string;
  employees: number;
  channels: string[];
  product_type: string;
  raw_prompt: string;
  owner_email: string;
  language_pref: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRole) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRole, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function addDays(days: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}

function deadlineForCycle(cycle: string): string {
  switch (cycle) {
    case "monthly":
      return addDays(30);
    case "bimonthly":
      return addDays(60);
    case "quarterly":
      return addDays(90);
    case "annual":
      return addDays(365);
    case "2 years":
      return addDays(730);
    default:
      return addDays(365);
  }
}

async function run(): Promise<void> {
  console.log("Seeding Compliance Copilot demo scenario...");

  const businessInsert = {
    name: "Warung Mak Jah",
    type: "fnb" as const,
    location: "Subang Jaya",
    state: "Selangor",
    council: "MBPJ",
    employees: 3,
    channels: ["offline", "online"],
    product_type: "halal food",
    raw_prompt: "Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak.",
    owner_email: "demo@warungmakjah.my",
    language_pref: "bm",
  };

  const { data: business, error: businessErr } = await supabase
    .from("businesses")
    .upsert(businessInsert, { onConflict: "owner_email" })
    .select("*")
    .single<DbBusiness>();

  if (businessErr || !business) {
    throw new Error(`Failed to seed business: ${businessErr?.message ?? "Unknown error"}`);
  }

  const rules = getRulesForBusiness({
    name: business.name,
    type: business.type,
    employees: business.employees,
    is_food: true,
    sells_online: true,
    product_type: business.product_type,
  });

  const itemRows = rules.map((rule) => ({
    business_id: business.id,
    name: rule.name,
    authority: rule.authority,
    deadline: deadlineForCycle(rule.renewal_cycle),
    renewal_cycle: rule.renewal_cycle,
    status: "pending",
    priority: rule.priority,
    risk_score: 100,
    penalty_rm_min: rule.penalty_rm_min,
    penalty_rm_max: rule.penalty_rm_max,
  }));

  const { data: items, error: itemsErr } = await supabase
    .from("compliance_items")
    .upsert(itemRows, { onConflict: "business_id,name" })
    .select("id,name");

  if (itemsErr || !items) {
    throw new Error(`Failed to seed compliance items: ${itemsErr?.message ?? "Unknown error"}`);
  }

  const byName = new Map(items.map((item) => [item.name, item.id]));

  const documents = [
    {
      business_id: business.id,
      compliance_item_id: byName.get("SSM Business Registration") ?? null,
      filename: "ssm-cert.pdf",
      extracted_data: {
        document_type: "SSM Business Registration",
        company_name: "Warung Mak Jah",
        reg_no: "202303223344",
      },
      expiry_date: addDays(240),
      anomaly_flags: [],
    },
    {
      business_id: business.id,
      compliance_item_id: byName.get("Premises Business Licence") ?? null,
      filename: "premise-license.pdf",
      extracted_data: {
        document_type: "Premises Business Licence",
        company_name: "Warung Mak Jah",
        reg_no: "MBPJ-778812",
      },
      expiry_date: addDays(45),
      anomaly_flags: [],
    },
    {
      business_id: business.id,
      compliance_item_id: byName.get("EPF + SOCSO Monthly") ?? null,
      filename: "epf-paid-current-month.pdf",
      extracted_data: {
        document_type: "EPF + SOCSO Monthly",
        company_name: "Warung Mak Jah",
        reg_no: "KWSP-992100",
      },
      expiry_date: addDays(25),
      anomaly_flags: [],
    },
  ];

  const { error: docsErr } = await supabase.from("documents").insert(documents);
  if (docsErr) {
    throw new Error(`Failed to seed documents: ${docsErr.message}`);
  }

  const riskOverrides = [
    { name: "SSM Business Registration", risk_score: 25, status: "compliant" },
    { name: "Premises Business Licence", risk_score: 80, status: "expiring_soon" },
    { name: "EPF + SOCSO Monthly", risk_score: 50, status: "pending" },
    { name: "SST Registration & Filing", risk_score: 100, status: "missing" },
    { name: "JAKIM Halal Certification", risk_score: 100, status: "missing" },
    { name: "Signboard Permit", risk_score: 100, status: "missing" },
    { name: "MDEC e-Commerce Reg", risk_score: 100, status: "missing" },
  ];

  for (const row of riskOverrides) {
    const { error } = await supabase
      .from("compliance_items")
      .update({ risk_score: row.risk_score, status: row.status })
      .eq("business_id", business.id)
      .eq("name", row.name);

    if (error) {
      throw new Error(`Failed risk override for ${row.name}: ${error.message}`);
    }
  }

  const { error: grantErr } = await supabase.from("grant_matches").upsert(
    {
      business_id: business.id,
      grant_name: "SME Digitalisation Grant",
      grant_body: "MDEC",
      value_rm: 5000,
      eligibility_pct: 92,
      apply_url: "https://mdec.my/",
    },
    { onConflict: "business_id,grant_name" },
  );

  if (grantErr) {
    throw new Error(`Failed to seed grant: ${grantErr.message}`);
  }

  const { error: eventErr } = await supabase.from("risk_events").insert({
    business_id: business.id,
    event_type: "seed",
    old_score: 100,
    new_score: 72,
    description: "Seed baseline created with ~RM72,000 penalty exposure.",
  });

  if (eventErr) {
    throw new Error(`Failed to seed risk event: ${eventErr.message}`);
  }

  console.log("Seed complete:");
  console.log("- Business: Warung Mak Jah (fnb)");
  console.log("- 7 compliance items seeded");
  console.log("- 3 documents uploaded, 4 missing");
  console.log("- Initial score approx: 72");
  console.log("- Penalty exposure approx: RM72,000");
}

run().catch((error: unknown) => {
  console.error("Seed failed", error);
  process.exit(1);
});