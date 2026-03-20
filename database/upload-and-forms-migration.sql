-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         UUID REFERENCES businesses(id) ON DELETE CASCADE,
  compliance_item_id  UUID REFERENCES compliance_items(id),
  filename            TEXT,
  extracted_data      JSONB,
  expiry_date         DATE,
  anomaly_flags       JSONB,
  uploaded_at         TIMESTAMPTZ DEFAULT now()
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID REFERENCES businesses(id) ON DELETE CASCADE,
  form_type     TEXT NOT NULL,
  fields_used   JSONB,
  filename      TEXT,
  generated_at  TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns for upload risk linkage
ALTER TABLE compliance_items
  ADD COLUMN IF NOT EXISTS document_uploaded BOOLEAN DEFAULT false;

ALTER TABLE compliance_items
  ADD COLUMN IF NOT EXISTS expiry_date DATE;

