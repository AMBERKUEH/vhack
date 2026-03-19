/**
 * Text Embeddings using Cohere API (Free tier: 1000 calls/month)
 * Sign up at: https://cohere.com/
 * 
 * Falls back to deterministic embeddings if no API key available
 */

// Cohere embed API endpoint
const COHERE_API_URL = "https://api.cohere.com/v2/embed";

// Fallback: Generate a deterministic 1024-dimensional embedding (for Cohere)
function generateSimpleEmbedding(text: string): number[] {
  const vec = new Array<number>(1024).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const idx = i % 1024;
    const code = text.charCodeAt(i);
    vec[idx] += (code % 97) / 97;
  }
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.COHERE_API_KEY?.trim() || process.env.HUGGINGFACE_API_KEY?.trim();
  
  if (!apiKey) {
    console.warn("No embedding API key set, using fallback embeddings");
    return generateSimpleEmbedding(text);
  }

  // Check if using HuggingFace key (starts with hf_)
  if (apiKey.startsWith('hf_')) {
    console.warn("HuggingFace Inference API deprecated, using fallback embeddings");
    return generateSimpleEmbedding(text);
  }

  try {
    const response = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "embed-english-v3.0",
        texts: [text],
        input_type: "search_query",
        embedding_types: ["float"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Cohere API error: ${response.status}, using fallback embeddings`, errorText);
      return generateSimpleEmbedding(text);
    }

    const result = await response.json();
    
    // Cohere returns embeddings in result.embeddings.float
    if (result.embeddings?.float?.[0]) {
      return result.embeddings.float[0];
    }
    
    console.warn("Unexpected Cohere response format, using fallback");
    return generateSimpleEmbedding(text);
  } catch (err) {
    console.warn("Embedding request failed, using fallback embeddings:", err);
    return generateSimpleEmbedding(text);
  }
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.COHERE_API_KEY?.trim() || process.env.HUGGINGFACE_API_KEY?.trim();
  
  if (!apiKey) {
    console.warn("No embedding API key set, using fallback embeddings");
    return texts.map(generateSimpleEmbedding);
  }

  // Check if using HuggingFace key (starts with hf_)
  if (apiKey.startsWith('hf_')) {
    console.warn("HuggingFace Inference API deprecated, using fallback embeddings");
    return texts.map(generateSimpleEmbedding);
  }

  try {
    const response = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "embed-english-v3.0",
        texts: texts,
        input_type: "search_document",
        embedding_types: ["float"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Cohere API error: ${response.status}, using fallback embeddings`, errorText);
      return texts.map(generateSimpleEmbedding);
    }

    const result = await response.json();
    
    // Cohere returns embeddings in result.embeddings.float
    if (result.embeddings?.float) {
      return result.embeddings.float;
    }
    
    console.warn("Unexpected Cohere response format, using fallback");
    return texts.map(generateSimpleEmbedding);
  } catch (err) {
    console.warn("Embedding request failed, using fallback embeddings:", err);
    return texts.map(generateSimpleEmbedding);
  }
}
