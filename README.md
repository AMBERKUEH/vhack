# Compliance Copilot v2

AI-powered compliance intelligence MVP for Malaysian SMEs.

## Stack
- Next.js 14 App Router + Tailwind + shadcn-style UI
- Next.js API Routes (TypeScript)
- Supabase (Postgres + pgvector)
- OpenAI (`gpt-4o-mini`, `text-embedding-3-small`)
- Gemini 2.5 Flash + Tesseract fallback OCR
- Twilio WhatsApp alerts
- Vercel Cron (`/api/alerts`)

## Setup
1. Clone and install
```bash
npm install
```
2. Configure env
```bash
cp .env.example .env.local
```
Fill all values in `.env.local`.

3. Apply DB schema in Supabase SQL editor
- Run: `database/schema.sql`

4. Seed demo data
```bash
npm run seed
```

5. Optional RAG ingestion (put PDFs in `rag-docs/`)
```bash
npm run ingest-rag
```

6. Run dev
```bash
npm run dev
```

## Demo flow
1. Open `/`
2. Submit onboarding prompt + email
3. Confirm profile on `/onboarding`
4. Review risk score and items on `/dashboard`
5. Test `/upload`, `/chat`, `/forms/cp204`, `/report`, `/alerts`

## Simulation mode
Set `SIMULATION_MODE=true` to force mocks if APIs/keys fail.
This guarantees hackathon demo resilience.