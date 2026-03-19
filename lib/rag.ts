import { createEmbedding } from "./embeddings";
import { createClient } from "@supabase/supabase-js";

export interface RagChunk {
  source: string;
  doc_title: string;
  page_ref: string;
  content: string;
  similarity: number;
}

export interface RagPrompt {
  system: string;
  user: string;
}

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function fallbackChunks(): RagChunk[] {
  return [
    {
      source: "jakim",
      doc_title: "Halal Certification Guide (fallback)",
      page_ref: "general knowledge",
      content: `JAKIM Halal certification in Malaysia requires:
1. Company must be registered with SSM
2. Submit application via MyHalal portal at halal.gov.my
3. Required documents: SSM cert, product list, ingredient list,
   production flow chart, premise layout, halal committee letter
4. Site audit will be conducted by JAKIM officers
5. Processing time: 3-6 months for new applications
6. Certificate valid for 2 years, renewable 6 months before expiry
7. Fee: RM200-2000 depending on company size
Penalties for false halal claims: up to RM3 million or 5 years jail
under Trade Descriptions Act 2011.`,
      similarity: 0.5,
    },
    {
      source: "lhdn",
      doc_title: "SST Guide (fallback)",
      page_ref: "general knowledge",
      content: `SST (Sales and Service Tax) in Malaysia:
Sales Tax: 5% or 10% on taxable goods
Service Tax: 8% on taxable services (6% for F&B and telecoms)
Registration threshold: RM500,000 annual taxable turnover
Filing frequency: Every 2 months (bimonthly)
Filing deadline: Last day of the month following the taxable period
Late filing penalty: RM10,000 to RM50,000 or 10x the tax amount
Payment via: MySST portal at mysst.customs.gov.my
CP204 (tax estimate) must be submitted by month 3 of the basis year`,
      similarity: 0.5,
    },
    {
      source: "ssm",
      doc_title: "Business Registration Guide (fallback)",
      page_ref: "general knowledge",
      content: `SSM Business Registration in Malaysia:
Sole proprietorship / Partnership: register under Registration of Businesses Act 1956
Private limited company (Sdn Bhd): register under Companies Act 2016
Annual return must be filed within 30 days of AGM
Failure to file annual return: compound fine up to RM50,000
Business registration renewal: annual, fee RM30-60 depending on type
Name search and reservation: via MyCoID portal at mycoID.ssm.com.my
Beneficial ownership declaration required for Sdn Bhd companies
Late renewal penalty: RM50 per month up to RM500`,
      similarity: 0.5,
    },
  ];
}

/**
 * Retrieve relevant context chunks from Supabase pgvector; fallback when unavailable.
 */
export async function retrieveContext(
  question: string,
  topK = 5,
  filterSource?: string,
): Promise<RagChunk[]> {
  try {
    if (!supabase || process.env.SIMULATION_MODE === "true") {
      return fallbackChunks();
    }

    const embedding = await createEmbedding(question);
    if (!embedding) {
      return fallbackChunks();
    }

    const { data, error } = await supabase.rpc("match_chunks", {
      query_embedding: embedding,
      match_count: topK,
      filter_source: filterSource ?? null,
    });

    if (error || !data || data.length === 0) {
      return fallbackChunks();
    }

    return data as RagChunk[];
  } catch {
    return fallbackChunks();
  }
}

/**
 * Build system and user prompts with retrieved regulation context.
 */
export function buildRagPrompt(
  question: string,
  chunks: RagChunk[],
  businessContext?: string,
): RagPrompt {
  const context = chunks
    .map(
      (chunk, idx) =>
        `${idx + 1}. [${chunk.source.toUpperCase()} - ${chunk.doc_title}, ${chunk.page_ref}]
${chunk.content}`,
    )
    .join("\n\n");

  const system = [
    "You are a compliance advisor for Malaysian SMEs.",
    "You help business owners understand their regulatory requirements for SSM, LHDN, JAKIM, EPF, and local councils.",
    "",
    "CRITICAL RULES - FOLLOW EXACTLY:",
    "1. Answer ONLY using the context provided below",
    "2. Write naturally - NEVER repeat words or phrases",
    "3. NEVER stutter or duplicate text like 'ToTo' or 'the the'",
    "4. Use plain text only - NO markdown (*, **, -)",
    "5. Write in short, clear sentences",
    "6. Use numbers (1, 2, 3) for lists, NOT bullets",
    "7. Always cite source at the end: (Sumber / Source: AGENCY - Document Name)",
    "8. Respond in the SAME language as the user's question",
    "9. If answer not in context, say: 'This information is not in my guide. Please check the official website.'",
    businessContext
      ? `\nBUSINESS CONTEXT: ${businessContext}\nTailor your answer to this specific business type.`
      : "",
    "\nREGULATION CONTEXT:",
    context,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    system,
    user: question,
  };
}

/**
 * Extract top citation string from top-ranked chunk.
 */
export function extractCitation(chunks: RagChunk[]): string {
  if (!chunks.length) return "";
  const top = chunks[0];
  return `(Source: ${top.source.toUpperCase()} - ${top.doc_title}, ${top.page_ref})`;
}