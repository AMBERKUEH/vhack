CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  type          TEXT CHECK (type IN ('fnb','retail','manufacturing','services','ecommerce')),
  location      TEXT,
  state         TEXT,
  council       TEXT,
  employees     INT DEFAULT 0,
  channels      TEXT[],
  product_type  TEXT,
  raw_prompt    TEXT,
  owner_email   TEXT UNIQUE,
  language_pref TEXT DEFAULT 'en',
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  authority      TEXT,
  deadline       DATE,
  renewal_cycle  TEXT,
  status         TEXT DEFAULT 'pending',
  risk_score     INT DEFAULT 100,
  priority       TEXT DEFAULT 'HIGH',
  penalty_rm_min INT DEFAULT 0,
  penalty_rm_max INT DEFAULT 0,
  notes          TEXT
);

CREATE TABLE IF NOT EXISTS documents (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id        UUID REFERENCES businesses(id) ON DELETE CASCADE,
  compliance_item_id UUID REFERENCES compliance_items(id),
  filename           TEXT,
  extracted_data     JSONB,
  expiry_date        DATE,
  anomaly_flags      JSONB,
  uploaded_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  event_type  TEXT,
  old_score   INT,
  new_score   INT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rag_chunks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source     TEXT,
  doc_title  TEXT,
  page_ref   TEXT,
  content    TEXT,
  embedding  vector(1536),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rag_chunks_embedding_idx ON rag_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE IF NOT EXISTS grant_matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  grant_name      TEXT,
  grant_body      TEXT,
  value_rm        INT,
  eligibility_pct INT,
  apply_url       TEXT,
  matched_at      TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID, source TEXT, doc_title TEXT,
  page_ref TEXT, content TEXT, similarity FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT id, source, doc_title, page_ref, content,
         1 - (embedding <=> query_embedding) AS similarity
  FROM rag_chunks
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

ALTER TABLE businesses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_matches    ENABLE ROW LEVEL SECURITY;
