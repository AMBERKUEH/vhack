-- Enable pgvector (skip if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- RAG knowledge base table
CREATE TABLE IF NOT EXISTS rag_chunks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source     TEXT NOT NULL,
  doc_title  TEXT NOT NULL,
  page_ref   TEXT,
  content    TEXT NOT NULL,
  embedding  vector(1536),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cosine similarity index for fast search
-- lists=100 is good for up to ~50,000 chunks
CREATE INDEX IF NOT EXISTS rag_chunks_embedding_idx
  ON rag_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Similarity search function used by /lib/rag.ts
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_count     int DEFAULT 5,
  filter_source   text DEFAULT NULL
)
RETURNS TABLE (
  id         UUID,
  source     TEXT,
  doc_title  TEXT,
  page_ref   TEXT,
  content    TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    id, source, doc_title, page_ref, content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM rag_chunks
  WHERE (filter_source IS NULL OR source = filter_source)
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;