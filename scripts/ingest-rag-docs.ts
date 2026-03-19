/**
 * Ingest text files from rag-docs/ folder into Supabase RAG
 * 
 * Usage:
 *   npx tsx scripts/ingest-rag-docs.ts
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { cleanText, chunkText, embedInBatches, insertToSupabase, printSummary, type IngestionSummaryRow } from "./rag-utils";

const RAG_DOCS_DIR = "./rag-docs";

// Map filenames to sources and titles
const FILE_MAPPINGS: Record<string, { source: string; doc_title: string }> = {
  "ssm-business.txt": { source: "ssm", doc_title: "SSM Business Registration Guide" },
  "jakim-halal-fnb.txt": { source: "jakim", doc_title: "JAKIM Halal Certification for F&B" },
  "lhdn-sst-threshold.txt": { source: "lhdn", doc_title: "LHDN SST Threshold Guide" },
  "epf-socso-eis.txt": { source: "epf", doc_title: "EPF SOCSO EIS Employer Guide" },
};

async function ingestFile(filename: string, source: string, docTitle: string): Promise<IngestionSummaryRow | null> {
  console.log(`\n📄 Processing: ${filename}`);
  
  try {
    const filepath = join(RAG_DOCS_DIR, filename);
    const text = readFileSync(filepath, "utf-8");
    
    if (!text.trim()) {
      console.warn(`⚠️ Empty file: ${filename}`);
      return null;
    }
    
    console.log(`   Raw text: ${text.length} chars`);
    
    // Clean and chunk
    const cleaned = cleanText(text);
    console.log(`   Cleaned: ${cleaned.length} chars`);
    
    const chunks = chunkText(cleaned, source, docTitle);
    console.log(`   Chunks: ${chunks.length}`);
    
    if (chunks.length === 0) {
      console.warn(`⚠️ No chunks generated for: ${filename}`);
      return null;
    }
    
    // Embed and insert
    const embedded = await embedInBatches(chunks);
    await insertToSupabase(embedded);
    
    console.log(`   ✅ Inserted ${embedded.length} chunks`);
    
    return {
      source,
      chunks: embedded.length,
      documentTitle: docTitle,
    };
  } catch (err) {
    console.error(`❌ Failed to process ${filename}:`, err);
    return null;
  }
}

async function main() {
  console.log("🚀 RAG Document Ingestion");
  console.log("=========================\n");
  
  // Get all .txt files from rag-docs
  const files = readdirSync(RAG_DOCS_DIR).filter(f => f.endsWith(".txt"));
  
  if (files.length === 0) {
    console.log("⚠️ No .txt files found in rag-docs/ folder");
    return;
  }
  
  console.log(`Found ${files.length} text file(s) to ingest\n`);
  
  const results: IngestionSummaryRow[] = [];
  
  for (const filename of files) {
    const mapping = FILE_MAPPINGS[filename];
    if (!mapping) {
      console.warn(`⚠️ Unknown file: ${filename}, skipping...`);
      continue;
    }
    
    const result = await ingestFile(filename, mapping.source, mapping.doc_title);
    if (result) {
      results.push(result);
    }
    
    // Small delay between files
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Print summary
  if (results.length > 0) {
    printSummary(results);
    console.log("\n✅ Ingestion complete!");
    console.log("\nNext steps:");
    console.log("  1. Verify with: npx tsx -r dotenv/config scripts/verify-rag.ts");
    console.log("  2. Test chat at: http://localhost:3000/chat");
  } else {
    console.log("\n⚠️ No documents were ingested");
  }
}

main().catch(err => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
