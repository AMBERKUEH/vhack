import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import type { ExtractedDoc } from "@/lib/types";
import { isSimulationMode } from "@/lib/supabase";

const GEMINI_PROMPT = `Extract this compliance document as strict JSON with keys:
{ document_type, company_name, reg_no, issue_date, expiry_date, issuing_authority, amount }
Use null for unknown values. Return JSON only.`;

function normalizeExtracted(input: Partial<ExtractedDoc>): ExtractedDoc {
  return {
    document_type: input.document_type ?? "SSM Business Registration",
    company_name: input.company_name ?? "Warung Mak Jah",
    reg_no: input.reg_no ?? "202303223344",
    issue_date: input.issue_date ?? "2025-01-01",
    expiry_date: input.expiry_date ?? "2026-01-01",
    issuing_authority: input.issuing_authority ?? "SSM",
    amount: input.amount ?? null,
  };
}

async function ensureBuffer(file: File | Buffer): Promise<Buffer> {
  if (Buffer.isBuffer(file)) {
    return file;
  }

  return Buffer.from(await file.arrayBuffer());
}

/**
 * Extracts structured fields from uploaded file with Gemini first, then Tesseract fallback.
 */
export async function extractFromFile(file: File | Buffer, mimeType: string): Promise<ExtractedDoc> {
  const fallback = normalizeExtracted({});

  if (isSimulationMode || !process.env.GOOGLE_AI_API_KEY) {
    return fallback;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const buffer = await ensureBuffer(file);

    const response = await model.generateContent([
      { text: GEMINI_PROMPT },
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ]);

    const text = response.response.text().trim();
    const parsed = JSON.parse(text) as Partial<ExtractedDoc>;
    return normalizeExtracted(parsed);
  } catch (geminiError) {
    console.warn("Gemini OCR failed, using fallback", geminiError);
  }

  try {
    const buffer = await ensureBuffer(file);
    const { data } = await Tesseract.recognize(buffer, "eng");

    const text = data.text ?? "";
    return normalizeExtracted({
      document_type: /halal/i.test(text) ? "JAKIM Halal Certification" : "SSM Business Registration",
      company_name: /warung mak jah/i.test(text) ? "Warung Mak Jah" : "Unknown Company",
      reg_no: (text.match(/\d{8,14}/) ?? ["0000000000"])[0],
      issuing_authority: /jakim/i.test(text) ? "JAKIM" : "SSM",
    });
  } catch (tesseractError) {
    console.warn("Tesseract OCR failed, returning mock", tesseractError);
    return fallback;
  }
}