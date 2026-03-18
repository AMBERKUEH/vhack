import fs from "node:fs/promises";
import path from "node:path";
import pdf from "pdf-parse";
import { cleanText, chunkText, embedInBatches, insertToSupabase, printSummary, type IngestionSummaryRow } from "./rag-utils";

const ROOT = path.join(process.cwd(), "rag-docs");
const SOURCE_DIRS = ["lhdn", "jakim", "ssm", "epf", "hrdf"] as const;

async function findPdfFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findPdfFiles(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      files.push(full);
    }
  }

  return files;
}

function titleFromFile(filePath: string): string {
  return path.basename(filePath).replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim();
}

async function processFile(filePath: string, source: string): Promise<IngestionSummaryRow | null> {
  try {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdf(buffer);

    const cleaned = cleanText(parsed.text || "");
    const docTitle = (parsed.info?.Title || titleFromFile(filePath)).trim();
    const chunks = chunkText(cleaned, source, docTitle);
    const embedded = await embedInBatches(chunks);
    await insertToSupabase(embedded);

    return {
      source,
      chunks: embedded.length,
      documentTitle: docTitle,
    };
  } catch (error) {
    console.warn(`Skipping file due to parse/ingest error: ${filePath}`, error);
    return null;
  }
}

async function main(): Promise<void> {
  const summary: IngestionSummaryRow[] = [];

  for (const source of SOURCE_DIRS) {
    const sourceDir = path.join(ROOT, source);
    try {
      const stats = await fs.stat(sourceDir);
      if (!stats.isDirectory()) continue;
    } catch {
      continue;
    }

    const files = await findPdfFiles(sourceDir);
    for (const filePath of files) {
      const row = await processFile(filePath, source);
      if (row) summary.push(row);
    }
  }

  printSummary(summary);
}

main().catch((error) => {
  console.error("ingest-rag failed", error);
  process.exit(1);
});