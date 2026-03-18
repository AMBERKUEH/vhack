import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import pdf from "pdf-parse";
import { getOpenAIClient } from "../lib/openai";
import { getSupabaseAdmin } from "../lib/supabase";

function detectSource(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.startsWith("lhdn-")) return "lhdn";
  if (lower.startsWith("jakim-")) return "jakim";
  if (lower.startsWith("ssm-")) return "ssm";
  if (lower.startsWith("epf-")) return "epf";
  if (lower.startsWith("hrdf-")) return "hrdf";
  return "other";
}

function chunkWords(text: string, size = 512, overlap = 50): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.length > 0) chunks.push(chunk);
  }
  return chunks;
}

async function run(): Promise<void> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OPENAI_API_KEY missing; cannot run ingest-rag without embeddings");
  }

  const supabase = getSupabaseAdmin();
  const ragDir = path.join(process.cwd(), "rag-docs");

  const files = (await fs.readdir(ragDir)).filter((name) => name.toLowerCase().endsWith(".pdf"));

  for (const fileName of files) {
    const fullPath = path.join(ragDir, fileName);
    const raw = await fs.readFile(fullPath);
    const parsed = await pdf(raw);
    const chunks = chunkWords(parsed.text, 512, 50);

    let processed = 0;

    for (let i = 0; i < chunks.length; i += 50) {
      const batch = chunks.slice(i, i + 50);
      const embeddings = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: batch,
      });

      const rows = batch.map((content, idx) => ({
        source: detectSource(fileName),
        doc_title: fileName,
        page_ref: "n/a",
        content,
        embedding: embeddings.data[idx]?.embedding,
      }));

      const { error } = await supabase.from("rag_chunks").insert(rows);
      if (error) {
        throw new Error(`Insert failed for ${fileName}: ${error.message}`);
      }

      processed += batch.length;
      console.log(`Ingested ${processed}/${chunks.length} chunks from ${fileName}`);
    }
  }

  console.log("RAG ingestion complete");
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});