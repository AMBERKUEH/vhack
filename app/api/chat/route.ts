import { NextRequest, NextResponse } from "next/server";
import { retrieveContext, buildRagPrompt } from "@/lib/rag";
import { createClient } from "@supabase/supabase-js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildFallbackFromChunks(question: string, chunks: Array<{ source: string; doc_title: string; page_ref: string; content: string }>): string {
  if (!chunks.length) {
    return "This information is not in my guide. Please check the official website.";
  }
  const top = chunks[0];
  const preview = top.content.replace(/\s+/g, " ").slice(0, 420);
  return [
    `Based on available guidance, here is the most relevant context for: "${question}"`,
    "",
    preview,
    "",
    `(Source: ${top.source.toUpperCase()} - ${top.doc_title}, ${top.page_ref})`,
  ].join("\n");
}

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

    const body = JSON.stringify({
      model: "llama-3.1-8b-instant",
      stream: true,
      temperature: 0.2,
      max_tokens: 280,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    let groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!groqResponse.ok && groqResponse.status === 429) {
      const retryAfter = Number(groqResponse.headers.get("retry-after") ?? "2");
      await sleep(Math.max(2000, retryAfter * 1000));
      groqResponse = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body,
      });
    }

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      console.error("Groq API error:", error);
      const fallback = buildFallbackFromChunks(question, chunks);
      return new Response(fallback, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Stream the response
    const reader = groqResponse.body?.getReader();
    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Parse SSE format
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n");
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.choices?.[0]?.delta?.content ?? "";
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
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
