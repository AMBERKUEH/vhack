import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import { retrieveContext, buildRagPrompt } from "@/lib/rag";
import { getOpenAIClient } from "@/lib/openai";

function streamFromText(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let index = 0;
      const chunks = text.split(" ");
      const interval = setInterval(() => {
        if (index >= chunks.length) {
          clearInterval(interval);
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(`${chunks[index]} `));
        index += 1;
      }, 25);
    },
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { question: string; businessId: string };
    if (!body.question || !body.businessId) {
      return NextResponse.json({ error: "question and businessId are required" }, { status: 400 });
    }

    if (isSimulationMode || !hasSupabaseEnv) {
      const fallbackText =
        "Untuk sijil halal JAKIM, anda perlukan SSM, lesen premis, senarai ramuan, dan SOP kebersihan. (Source: JAKIM - Halal Manual, p.14)";
      return new Response(streamFromText(fallbackText), { headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    const chunks = await retrieveContext(body.question);
    const supabase = getSupabaseAdmin();
    const { data: business } = await supabase
      .from("businesses")
      .select("name,type,language_pref")
      .eq("id", body.businessId)
      .maybeSingle();

    const prompt = buildRagPrompt(body.question, chunks);
    const openai = getOpenAIClient();

    if (!openai) {
      const fallbackText =
        "I don't have that info - check official website. (Source: JAKIM - Halal Manual, p.14)";
      return new Response(streamFromText(fallbackText), { headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: prompt.system },
          {
            role: "user",
            content: `${prompt.user}\n\nBusiness Context: ${business?.name ?? "Unknown"} (${business?.type ?? "unknown"})`,
          },
        ],
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream<Uint8Array>({
        async start(controller) {
          for await (const part of stream) {
            const token = part.choices[0]?.delta?.content;
            if (token) {
              controller.enqueue(encoder.encode(token));
            }
          }
          controller.close();
        },
      });

      return new Response(readable, { headers: { "content-type": "text/plain; charset=utf-8" } });
    } catch (error) {
      console.warn("Streaming failed, using simulated response", error);
      const fallbackText =
        "I don't have that info - check official website. (Source: JAKIM - Halal Manual, p.14)";
      return new Response(streamFromText(fallbackText), { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
  } catch (error) {
    console.error("/api/chat failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}