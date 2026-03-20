CREATE TABLE IF NOT EXISTS email_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  language    TEXT DEFAULT 'en',
  active      BOOLEAN DEFAULT true,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alert_logs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id        UUID REFERENCES businesses(id) ON DELETE CASCADE,
  compliance_item_id UUID REFERENCES compliance_items(id) ON DELETE CASCADE,
  channel            TEXT NOT NULL,
  threshold_days     INT NOT NULL,
  sent_to            TEXT NOT NULL,
  log_key            TEXT UNIQUE NOT NULL,
  sent_at            TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

