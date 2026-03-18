import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export interface Chunk {
  source: string;
  doc_title: string;
  page_ref: string;
  content: string;
}

export interface ChunkWithEmbedding extends Chunk {
  embedding: number[];
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

const SIMULATION_MODE = process.env.SIMULATION_MODE === "true";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNoiseLine(line: string): boolean {
  if (line.length < 20) return true;
  if (/^\d+$/.test(line)) return true;
  if (/^[-_\s]+$/.test(line)) return true;
  return false;
}

function stripEmbeddingHeader(content: string): string {
  return content.replace(/^\[[^\]]+\]\s*/, "").trim();
}

function sourceLabel(source: string): string {
  return source.toUpperCase();
}

function deterministicEmbedding(text: string): number[] {
  const vec = new Array<number>(1536).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const idx = i % 1536;
    const code = text.charCodeAt(i);
    vec[idx] += (code % 97) / 97;
  }
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

/**
 * Remove noisy lines and duplicated headers/footers from extracted PDF text.
 */
export function cleanText(text: string): string {
  const rawLines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim());

  const frequency = new Map<string, number>();
  rawLines.forEach((line) => {
    if (!line) return;
    frequency.set(line, (frequency.get(line) ?? 0) + 1);
  });

  const filtered = rawLines.filter((line) => {
    if (!line) return true;
    if (isNoiseLine(line)) return false;
    const count = frequency.get(line) ?? 0;
    if (count >= 5) return false;
    return true;
  });

  const collapsed = filtered
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

  return collapsed;
}

/**
 * Chunk cleaned text into overlapping sentence-aware chunks for embedding.
 */
export function chunkText(text: string, source: string, docTitle: string): Chunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  const targetSize = 400;
  const overlap = 50;

  const rawChunks: string[] = [];
  let cursor = 0;

  while (cursor < words.length) {
    let end = Math.min(words.length, cursor + targetSize);

    if (end < words.length) {
      const maxScan = Math.min(words.length, end + 80);
      let splitPoint = -1;
      for (let i = end; i < maxScan; i += 1) {
        if (/[.!?]$/.test(words[i] ?? "")) {
          splitPoint = i + 1;
          break;
        }
      }
      if (splitPoint > 0) {
        end = splitPoint;
      }
    }

    const chunkWords = words.slice(cursor, end);
    if (chunkWords.length >= 40) {
      rawChunks.push(chunkWords.join(" "));
    }

    if (end >= words.length) break;
    cursor = Math.max(end - overlap, cursor + 1);
  }

  const total = rawChunks.length;
  return rawChunks.map((chunk, idx) => ({
    source,
    doc_title: docTitle,
    page_ref: `chunk ${idx + 1} of ${total}`,
    content: `[${sourceLabel(source)} - ${docTitle}] ${chunk}`,
  }));
}

/**
 * Embed chunk content in batches using text-embedding-3-small with retry + backoff.
 */
export async function embedInBatches(chunks: Chunk[]): Promise<ChunkWithEmbedding[]> {
  const batchSize = 100;
  const totalBatches = Math.ceil(chunks.length / batchSize);
  const embedded: ChunkWithEmbedding[] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const batchNo = Math.floor(i / batchSize) + 1;
    console.log(`Embedding batch ${batchNo}/${totalBatches} - ${batch.length} chunks`);

    if (SIMULATION_MODE || !openai) {
      embedded.push(
        ...batch.map((chunk) => ({
          ...chunk,
          embedding: deterministicEmbedding(chunk.content),
        })),
      );
      await sleep(100);
      continue;
    }

    const doEmbed = async (): Promise<ChunkWithEmbedding[]> => {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: batch.map((chunk) => chunk.content),
      });

      return batch.map((chunk, idx) => ({
        ...chunk,
        embedding: response.data[idx]?.embedding ?? deterministicEmbedding(chunk.content),
      }));
    };

    try {
      const result = await doEmbed();
      embedded.push(...result);
    } catch (err) {
      console.warn(`Embedding failed for batch ${batchNo}, retrying once...`, err);
      await sleep(2000);
      try {
        const retry = await doEmbed();
        embedded.push(...retry);
      } catch (retryErr) {
        console.error(`Embedding batch ${batchNo} skipped after retry`, retryErr);
      }
    }

    if (i + batchSize < chunks.length) {
      await sleep(600);
    }
  }

  return embedded;
}

/**
 * Insert embedded chunks to Supabase in batches after deleting prior doc rows.
 */
export async function insertToSupabase(chunks: ChunkWithEmbedding[]): Promise<void> {
  if (chunks.length === 0) return;

  const titles = [...new Set(chunks.map((chunk) => chunk.doc_title))];

  if (SIMULATION_MODE || !supabase) {
    titles.forEach((title) => {
      const count = chunks.filter((c) => c.doc_title === title).length;
      console.log(`[SIMULATION] Inserted ${count}/${count} chunks for ${title}`);
    });
    return;
  }

  for (const title of titles) {
    const { error: deleteError } = await supabase.from("rag_chunks").delete().eq("doc_title", title);
    if (deleteError) {
      console.warn(`Delete existing rows failed for ${title}: ${deleteError.message}`);
    }
  }

  const byDoc = new Map<string, ChunkWithEmbedding[]>();
  chunks.forEach((chunk) => {
    const arr = byDoc.get(chunk.doc_title) ?? [];
    arr.push(chunk);
    byDoc.set(chunk.doc_title, arr);
  });

  for (const [docTitle, docChunks] of byDoc.entries()) {
    const total = docChunks.length;
    let inserted = 0;

    for (let i = 0; i < docChunks.length; i += 50) {
      const batch = docChunks.slice(i, i + 50);
      const rows = batch.map((chunk) => ({
        source: chunk.source,
        doc_title: chunk.doc_title,
        page_ref: chunk.page_ref,
        content: stripEmbeddingHeader(chunk.content),
        embedding: chunk.embedding,
      }));

      const { error } = await supabase.from("rag_chunks").insert(rows);
      if (error) {
        console.error(`Insert batch failed for ${docTitle}: ${error.message}`);
      } else {
        inserted += rows.length;
      }

      console.log(`Inserted ${inserted}/${total} chunks for ${docTitle}`);
    }
  }
}

export interface IngestionSummaryRow {
  source: string;
  chunks: number;
  documentTitle: string;
}

/**
 * Print fixed-width ingestion summary table.
 */
export function printSummary(rows: IngestionSummaryRow[]): void {
  const total = rows.reduce((sum, row) => sum + row.chunks, 0);
  console.log("+-------------------------------------------------+");
  console.log("¦ RAG INGESTION COMPLETE                          ¦");
  console.log("+-------------------------------------------------¦");
  console.log("¦ Source   ¦ Chunks    ¦ Document Title           ¦");
  console.log("+----------+-----------+--------------------------¦");
  rows.forEach((row) => {
    const source = row.source.padEnd(8, " ");
    const chunks = String(row.chunks).padEnd(9, " ");
    const title = row.documentTitle.slice(0, 24).padEnd(24, " ");
    console.log(`¦ ${source} ¦ ${chunks} ¦ ${title} ¦`);
  });
  console.log("+----------+-----------+--------------------------¦");
  console.log(`¦ TOTAL    ¦ ${String(total).padEnd(9, " ")} ¦ ${"".padEnd(24, " ")} ¦`);
  console.log("+-------------------------------------------------+");
}