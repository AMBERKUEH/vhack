# LULUS AI (Compliance Copilot v2)

AI-powered compliance intelligence platform for Malaysian SMEs.

## Tech Stack
- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes (TypeScript)
- Database: Supabase (PostgreSQL + pgvector + Auth + RLS)
- LLM extraction/chat: Groq + OpenAI-compatible chat flow (project-configurable)
- OCR: Gemini (`@google/generative-ai`) with structured JSON extraction
- PDF: `pdf-lib` for report and form generation
- Alerts: Resend email + scheduled checks (`/api/cron/check_alerts`)
- Vector/RAG ingestion scripts: `ts-node`/`tsx` scripts under `scripts/`

## Product Flow
1. Public landing page: `/`
2. Auth page: `/auth`
3. Onboarding page (protected): `/onboard`
4. Dashboard (protected): `/dashboard`
5. Document upload + OCR + form autofill: `/upload`
6. AI compliance chat: `/chat`
7. Compliance report + PDF download: `/report`
8. Alerts setup: `/alerts`

## Core Features
- Prompt-based business onboarding and profile extraction
- Business-specific compliance item seeding
- Live risk scoring and penalty exposure visualization
- OCR document upload and compliance linking
- Pre-filled form draft downloads:
  - SSM Borang A (real template overlay via `/public/forms/borang-a.pdf`)
  - LHDN CP204 (generated PDF draft)
- Downloadable 2-page compliance health report PDF
- Grants matching
- Alert preference + scheduled deadline checks

## Environment Setup
1. Install dependencies:
```bash
npm install
```

2. Create local env:
```bash
cp .env.example .env.local
```

3. Fill required keys in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_AI_API_KEY`
- `GROQ_API_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `SIMULATION_MODE`

## Database Setup (Supabase SQL Editor)
Run in this order:
1. `database/schema.sql`
2. `database/rag-schema.sql`
3. `database/upload-and-forms-migration.sql`
4. `database/email-alerts-migration.sql` (if using alerts)
5. `database/user-id-migration.sql` (if present in your repo flow)
6. `database/rls-policies.sql`

## Required File for Real SSM Overlay
Place the official Borang A template here:
`/public/forms/borang-a.pdf`

If missing, SSM form generation returns:
`SSM form template not found. Please contact support.`

## Run Locally
```bash
npm run dev
```
Open `http://localhost:3000`

## Build Check
```bash
npm run build
```

## Optional Scripts
- Seed data:
```bash
npm run seed
```
- RAG ingest from files:
```bash
npm run ingest-rag
```
- Verify retrieval quality:
```bash
npm run verify-rag
```

## API Highlights
- `POST /api/onboard/extract` — extract business profile from prompt
- `POST /api/onboard` — save business + seed compliance + grants
- `GET /api/risk` — recompute and return risk data
- `POST /api/upload` — OCR + anomaly checks + document linking
- `POST /api/forms/generate-pdf` — SSM/LHDN draft PDF generation
- `POST /api/report/generate-pdf` — downloadable 2-page compliance report

## Notes
- Protected routes are guarded by middleware.
- Dashboard and report read real Supabase data.
- `SIMULATION_MODE=false` is recommended for real demo data paths.
