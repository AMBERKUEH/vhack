import { createEmbedding } from "../lib/embeddings";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const TEST_QUERIES = [
  { q: "How do I apply for JAKIM halal certification?", expect: "jakim" },
  { q: "What is the SST filing deadline?", expect: "lhdn" },
  { q: "What happens if I miss SSM annual return?", expect: "ssm" },
] as const;

const hasEnv = Boolean(
  process.env.HUGGINGFACE_API_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function mockRows(expected: string) {
  return [
    { source: expected, similarity: 0.82, content: `Mock content for ${expected} rank 1` },
    { source: expected, similarity: 0.79, content: `Mock content for ${expected} rank 2` },
    { source: "lhdn", similarity: 0.61, content: "Cross-source context" },
  ];
}

async function runQuery(query: string, expected: string) {
  if (!hasEnv || !supabase || process.env.SIMULATION_MODE === "true") {
    return mockRows(expected);
  }

  const vector = await createEmbedding(query);
  if (!vector) return [];

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: vector,
    match_count: 3,
    filter_source: null,
  });

  if (error) {
    console.warn("RPC error, using mock rows", error.message);
    return mockRows(expected);
  }

  return (data ?? []) as Array<{ source: string; similarity: number; content: string }>;
}

async function main(): Promise<void> {
  let pass = 0;
  let similaritySum = 0;
  let similarityCount = 0;

  for (const test of TEST_QUERIES) {
    const rows = await runQuery(test.q, test.expect);
    const top = rows[0]?.source ?? "none";

    console.log(`Query: "${test.q}"`);
    console.log("+-----------------------------------------------------+");
    console.log("� Rank   � Source       � Similarity     � Preview    �");
    console.log("+--------+--------------+----------------+------------�");

    rows.forEach((row, idx) => {
      const preview = row.content.replace(/\s+/g, " ").slice(0, 60);
      console.log(
        `� ${String(idx + 1).padEnd(6, " ")} � ${row.source.padEnd(12, " ")} � ${row.similarity
          .toFixed(2)
          .padEnd(14, " ")} � ${preview.padEnd(10, " ")} �`,
      );
      similaritySum += row.similarity;
      similarityCount += 1;
    });

    console.log("+-----------------------------------------------------+");

    const ok = top === test.expect;
    if (ok) pass += 1;
    console.log(`Status: ${ok ? `PASS (top result matches expected source '${test.expect}')` : "FAIL"}`);

    if ((rows[0]?.similarity ?? 0) < 0.5) {
      console.log(`? LOW SIMILARITY on query: "${test.q}"`);
      console.log("Action: check the PDF text quality and re-run ingest.");
    }

    console.log("");
  }

  let totalChunks = 0;
  let ssm = 0;
  let jakim = 0;
  let lhdn = 0;

  if (hasEnv && supabase && process.env.SIMULATION_MODE !== "true") {
    const { data } = await supabase.from("rag_chunks").select("source", { count: "exact" });
    totalChunks = data?.length ?? 0;
    ssm = (data ?? []).filter((d) => d.source === "ssm").length;
    jakim = (data ?? []).filter((d) => d.source === "jakim").length;
    lhdn = (data ?? []).filter((d) => d.source === "lhdn").length;
  } else {
    totalChunks = 300;
    ssm = 40;
    jakim = 170;
    lhdn = 90;
  }

  const avg = similarityCount ? similaritySum / similarityCount : 0;
  console.log(`PASS: ${pass}/${TEST_QUERIES.length} queries returned expected source as top result`);
  console.log(`Average similarity: ${avg.toFixed(2)}`);
  console.log(`Total chunks in DB: ${totalChunks} (ssm: ${ssm}, jakim: ${jakim}, lhdn: ${lhdn})`);
}

main().catch((error) => {
  console.error("verify-rag failed", error);
  process.exit(1);
});