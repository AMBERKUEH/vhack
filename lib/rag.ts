import type { ChunkResult } from "@/lib/types";
import { getOpenAIClient } from "@/lib/openai";
import { getSupabaseAdmin, isSimulationMode } from "@/lib/supabase";

/**
 * Retrieves top context chunks from Supabase pgvector RPC.
 */
export async function retrieveContext(question: string, topK = 5): Promise<ChunkResult[]> {
  if (isSimulationMode) {
    return [
      {
        source: "jakim",
        doc_title: "JAKIM Halal Manual",
        page_ref: "14",
        content: "Permohonan halal memerlukan SSM, lesen premis, senarai bahan, dan proses kebersihan.",
        similarity: 0.91,
      },
    ];
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return [
      {
        source: "jakim",
        doc_title: "JAKIM Halal Manual",
        page_ref: "14",
        content: "Permohonan halal memerlukan SSM, lesen premis, senarai bahan, dan proses kebersihan.",
        similarity: 0.91,
      },
    ];
  }

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const vector = embedding.data[0]?.embedding;
  if (!vector) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: vector,
    match_count: topK,
  });

  if (error) {
    console.warn("RAG retrieval failed", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    return [
      {
        source: "jakim",
        doc_title: "JAKIM Halal Manual",
        page_ref: "14",
        content: "Permohonan halal memerlukan SSM, lesen premis, senarai bahan, dan proses kebersihan.",
        similarity: 0.88,
      },
    ];
  }

  return data as ChunkResult[];
}

/**
 * Builds system and user prompts for constrained RAG answering.
 */
export function buildRagPrompt(question: string, chunks: ChunkResult[]): { system: string; user: string } {
  const contextBlocks = chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] Source: ${chunk.source.toUpperCase()} - ${chunk.doc_title}, p.${chunk.page_ref}\n${chunk.content}`,
    )
    .join("\n\n");

  const system =
    "You are a Malaysian SME compliance advisor. Answer only from provided context. Cite source like (Source: LHDN - SST Guide, p.12). Respond in the same language as the user (BM or English). If answer is missing in context, say: I don't have that info - check official website.";

  const user = `Question:\n${question}\n\nContext:\n${contextBlocks || "[No context available]"}`;

  return { system, user };
}