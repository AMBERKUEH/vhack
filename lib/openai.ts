import OpenAI from "openai";
import { isSimulationMode } from "@/lib/supabase";

/**
 * Returns an OpenAI client when key exists, otherwise null.
 */
export function getOpenAIClient(): OpenAI | null {
  if (isSimulationMode || !process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}