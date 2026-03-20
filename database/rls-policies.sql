-- Run this AFTER:
-- 1) database/schema.sql
-- 2) database/rag-schema.sql
-- 3) database/upload-and-forms-migration.sql

-- Ensure RLS is enabled on all app tables.
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_chunks ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------
-- BUSINESSES
-- Owner model: businesses.owner_email must match auth email
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS businesses_select_own ON businesses;
CREATE POLICY businesses_select_own
  ON businesses
  FOR SELECT
  TO authenticated
  USING (owner_email = (auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS businesses_insert_own ON businesses;
CREATE POLICY businesses_insert_own
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_email = (auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS businesses_update_own ON businesses;
CREATE POLICY businesses_update_own
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (owner_email = (auth.jwt() ->> 'email'))
  WITH CHECK (owner_email = (auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS businesses_delete_own ON businesses;
CREATE POLICY businesses_delete_own
  ON businesses
  FOR DELETE
  TO authenticated
  USING (owner_email = (auth.jwt() ->> 'email'));

-- -------------------------------------------------------------------
-- COMPLIANCE ITEMS
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS compliance_items_select_own ON compliance_items;
CREATE POLICY compliance_items_select_own
  ON compliance_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = compliance_items.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS compliance_items_insert_own ON compliance_items;
CREATE POLICY compliance_items_insert_own
  ON compliance_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = compliance_items.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS compliance_items_update_own ON compliance_items;
CREATE POLICY compliance_items_update_own
  ON compliance_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = compliance_items.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = compliance_items.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS compliance_items_delete_own ON compliance_items;
CREATE POLICY compliance_items_delete_own
  ON compliance_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = compliance_items.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

-- -------------------------------------------------------------------
-- DOCUMENTS
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS documents_select_own ON documents;
CREATE POLICY documents_select_own
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = documents.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS documents_insert_own ON documents;
CREATE POLICY documents_insert_own
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = documents.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS documents_update_own ON documents;
CREATE POLICY documents_update_own
  ON documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = documents.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = documents.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS documents_delete_own ON documents;
CREATE POLICY documents_delete_own
  ON documents
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = documents.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

-- -------------------------------------------------------------------
-- RISK EVENTS
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS risk_events_select_own ON risk_events;
CREATE POLICY risk_events_select_own
  ON risk_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = risk_events.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS risk_events_insert_own ON risk_events;
CREATE POLICY risk_events_insert_own
  ON risk_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = risk_events.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS risk_events_update_own ON risk_events;
CREATE POLICY risk_events_update_own
  ON risk_events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = risk_events.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = risk_events.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS risk_events_delete_own ON risk_events;
CREATE POLICY risk_events_delete_own
  ON risk_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = risk_events.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

-- -------------------------------------------------------------------
-- GRANT MATCHES
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS grant_matches_select_own ON grant_matches;
CREATE POLICY grant_matches_select_own
  ON grant_matches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = grant_matches.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS grant_matches_insert_own ON grant_matches;
CREATE POLICY grant_matches_insert_own
  ON grant_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = grant_matches.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS grant_matches_update_own ON grant_matches;
CREATE POLICY grant_matches_update_own
  ON grant_matches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = grant_matches.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = grant_matches.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS grant_matches_delete_own ON grant_matches;
CREATE POLICY grant_matches_delete_own
  ON grant_matches
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = grant_matches.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

-- -------------------------------------------------------------------
-- FORM SUBMISSIONS
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS form_submissions_select_own ON form_submissions;
CREATE POLICY form_submissions_select_own
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = form_submissions.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS form_submissions_insert_own ON form_submissions;
CREATE POLICY form_submissions_insert_own
  ON form_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = form_submissions.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS form_submissions_update_own ON form_submissions;
CREATE POLICY form_submissions_update_own
  ON form_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = form_submissions.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = form_submissions.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS form_submissions_delete_own ON form_submissions;
CREATE POLICY form_submissions_delete_own
  ON form_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM businesses b
      WHERE b.id = form_submissions.business_id
        AND b.owner_email = (auth.jwt() ->> 'email')
    )
  );

-- -------------------------------------------------------------------
-- RAG CHUNKS
-- Keep read-only for authenticated users.
-- Writes happen from server-side scripts with service role key.
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS rag_chunks_read_authenticated ON rag_chunks;
CREATE POLICY rag_chunks_read_authenticated
  ON rag_chunks
  FOR SELECT
  TO authenticated
  USING (true);

