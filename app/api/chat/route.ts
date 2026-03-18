import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { retrieveContext, buildRagPrompt } from "@/lib/rag";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { question, businessId, language } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    if (process.env.SIMULATION_MODE === "true") {
      const mockAnswer =
        language === "bm"
          ? "Untuk memohon Sijil Halal JAKIM, anda perlu mendaftar di portal MyHalal di halal.gov.my. Dokumen yang diperlukan termasuk sijil SSM, senarai produk, dan carta alir pengeluaran. Proses kelulusan mengambil masa 3-6 bulan. (Sumber: JAKIM - Prosedur Pensijilan Halal)"
          : "To apply for JAKIM Halal certification, register at the MyHalal portal at halal.gov.my. Required documents include SSM certificate, product list, and production flowchart. Approval takes 3-6 months. (Source: JAKIM - Halal Certification Procedures)";

      const encoder = new TextEncoder();
      const words = mockAnswer.split(" ");
      const readable = new ReadableStream({
        async start(controller) {
          for (const word of words) {
            controller.enqueue(encoder.encode(`${word} `));
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    let businessContext: string | undefined;
    if (businessId && businessId !== "mock-business-1") {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { data } = await supabase
        .from("businesses")
        .select("type, location, employees, product_type")
        .eq("id", businessId)
        .single();

      if (data) {
        businessContext = `${data.type} business in ${data.location}, ${data.employees} employees, ${data.product_type}`;
      }
    }

    const chunks = await retrieveContext(question);
    const { system, user } = buildRagPrompt(question, chunks, businessContext);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.3,
      max_tokens: 600,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          console.error("Streaming error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Chat unavailable. Please try again." }, { status: 500 });
  }
}