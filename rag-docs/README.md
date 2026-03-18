# RAG Knowledge Base - PDF Sources

## Currently ingested (from pasted PDFs)
The following documents were extracted directly from PDFs
provided during setup and embedded into the knowledge base:

- SSM: GUIDELINE FOR REGISTATION OF NEW BUSINESS
- JAKIM: Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020
- LHDN: E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6)

## Adding more PDFs later
Place PDFs into the correct subfolder and run:
  npm run ingest-rag

Subfolders:
  /rag-docs/lhdn/    -> LHDN tax and e-invoice documents
  /rag-docs/jakim/   -> JAKIM halal certification documents
  /rag-docs/ssm/     -> SSM registration and compliance documents
  /rag-docs/epf/     -> EPF employer contribution guides
  /rag-docs/hrdf/    -> HRDF levy guides

## Recommended additional PDFs
LHDN:
  SST Industry Guide - mysst.customs.gov.my -> Guide & FAQ
  e-Invoice Implementation Guide - hasil.gov.my -> e-Invoice
  CP204 Guide - hasil.gov.my -> Forms -> CP204

JAKIM:
  Full Halal Certification Procedures Manual - halal.gov.my
  Halal Product Categories - halal.gov.my -> Categories

SSM:
  Companies Act 2016 Summary - ssm.com.my -> Resources
  Annual Return Guide - ssm.com.my -> e-Services

EPF:
  Employer Contribution Rates - kwsp.gov.my -> Contribution

HRDF:
  Levy Contribution Guide - hrdf.com.my -> Employer

## Hackathon minimum
The 3 pasted PDFs already cover the most important
demo questions. Additional PDFs improve answer quality
but are not required for a working demo.