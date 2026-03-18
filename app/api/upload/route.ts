import { NextResponse } from "next/server";
import { extractFromFile } from "@/lib/ocr";
import { detectAnomalies } from "@/lib/anomaly";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { MOCK_BUSINESS } from "@/lib/mock";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const businessId = String(formData.get("businessId") ?? "");

    if (!(file instanceof File) || !businessId) {
      return NextResponse.json({ error: "file and businessId are required" }, { status: 400 });
    }

    const extracted = await extractFromFile(file, file.type || "application/octet-stream");

    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({
        extracted_data: extracted,
        anomaly_flags: [{ field: "company_name", issue: "Minor name mismatch", severity: "warning" }],
        updated_risk_score: 52,
      });
    }

    const supabase = getSupabaseAdmin();
    const { data: business, error: businessErr } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (businessErr || !business) {
      return NextResponse.json({ error: businessErr?.message ?? "Business not found" }, { status: 404 });
    }

    const anomalyFlags = await detectAnomalies(extracted, business ?? MOCK_BUSINESS);

    await supabase.from("documents").insert({
      business_id: businessId,
      filename: file.name,
      extracted_data: extracted,
      expiry_date: extracted.expiry_date,
      anomaly_flags: anomalyFlags,
    });

    return NextResponse.json({ extracted_data: extracted, anomaly_flags: anomalyFlags, updated_risk_score: 52 });
  } catch (error) {
    console.error("/api/upload failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}