import { NextResponse } from "next/server";
import type { BusinessProfile } from "@/lib/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface ExtractBody {
  prompt: string;
}

/**
 * Extracts a structured Malaysian SME profile from natural language input.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ExtractBody;
    if (!body?.prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is missing" }, { status: 500 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a Malaysian business classifier. Extract the business profile from this description. Return ONLY valid JSON with these exact keys: { name: string (business name if mentioned, else generate from type+location), type: string (one of: fnb, retail, manufacturing, services, ecommerce), location: string (city name), state: string (Malaysian state), council: string (local council if known, else derive from location), employees: number, channels: array of strings (online, offline, export), product_type: string (what they sell), language_pref: string (en or bm based on input language) }. No markdown. No explanation. JSON only.",
          },
          { role: "user", content: body.prompt },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: `Groq extraction failed: ${text}` }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Groq did not return profile content" }, { status: 502 });
    }

    const parsed = JSON.parse(content) as Partial<BusinessProfile> & {
      council?: string;
      language_pref?: string;
    };

    const profile = {
      name: parsed.name ?? "New Business",
      type: (parsed.type ?? "services") as BusinessProfile["type"],
      location: parsed.location ?? "Malaysia",
      state: parsed.state ?? "Unknown",
      council: parsed.council ?? "Unknown Council",
      employees: Number(parsed.employees ?? 0),
      channels: Array.isArray(parsed.channels) ? parsed.channels : ["offline"],
      product_type: parsed.product_type ?? "general",
      language_pref: parsed.language_pref === "bm" ? "bm" : "en",
      sells_online: Array.isArray(parsed.channels) ? parsed.channels.includes("online") : false,
      is_food: (parsed.product_type ?? "").toLowerCase().includes("food"),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Extract onboarding profile failed:", error);
    return NextResponse.json({ error: "Failed to extract profile from prompt" }, { status: 500 });
  }
}

