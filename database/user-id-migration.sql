ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS user_id UUID;

CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON businesses(user_id);

