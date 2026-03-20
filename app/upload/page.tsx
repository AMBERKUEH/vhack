"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatRM } from "@/lib/risk";

type Authority = "SSM" | "LHDN" | "Unknown";

type ExtractedData = {
  document_type: string;
  company_name: string | null;
  reg_no: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  authority: Authority;
  amount: number | null;
  invoice_no: string | null;
  supplier_name: string | null;
  supplier_tin: string | null;
  msic_code: string | null;
  total_amount: number | null;
  tax_amount: number | null;
};

type UploadResponse = {
  success: boolean;
  document_id: string;
  extracted_data: ExtractedData;
  anomaly_flags: Array<{ code: string; message: string; severity: "warning" | "error" }>;
  authority: Authority;
  document_type: string;
  linked_item_id: string | null;
  old_score: number;
  new_score: number;
  score_dropped_by: number;
  penalty_exposure: number;
};

type BusinessProfile = {
  id: string;
  name: string;
  location: string;
  type: string;
};
type ComplianceChoice = { id: string; name: string; authority: string | null };

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toInputValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function toNumberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBusinessProfile(): BusinessProfile | null {
  const raw = localStorage.getItem("cc_business");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<BusinessProfile>;
    if (!parsed.id) return null;
    return {
      id: parsed.id,
      name: parsed.name ?? "",
      location: parsed.location ?? "",
      type: parsed.type ?? "",
    };
  } catch {
    return null;
  }
}

export default function UploadPage(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [editable, setEditable] = useState<ExtractedData | null>(null);
  const [confirmErrors, setConfirmErrors] = useState(false);
  const [downloading, setDownloading] = useState<"ssm" | "lhdn-cp204" | null>(null);
  const [displayScore, setDisplayScore] = useState<{ from: number; to: number } | null>(null);
  const [choices, setChoices] = useState<ComplianceChoice[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");

  const businessProfile = useMemo<BusinessProfile | null>(() => {
    if (typeof window === "undefined") return null;
    return parseBusinessProfile();
  }, []);

  useEffect(() => {
    if (!result) return;
    setDisplayScore({ from: result.old_score, to: result.new_score });
  }, [result]);

  useEffect(() => {
    if (!businessProfile?.id) return;
    fetch(`/api/compliance?businessId=${businessProfile.id}`)
      .then((r) => r.json())
      .then((data) => {
        const rows = (data as { items?: ComplianceChoice[] }).items ?? [];
        setChoices(rows);
        if (rows.length) setSelectedItemId(rows[0].id);
      })
      .catch(() => {
        setChoices([]);
      });
  }, [businessProfile?.id]);

  const onSelectFile = (selected: File | null): void => {
    setFile(selected);
    setUploadError(null);
  };

  const runUpload = async (): Promise<void> => {
    if (!file || !businessProfile?.id) {
      setUploadError("Please select a file and make sure business profile exists.");
      return;
    }

    setLoading(true);
    setProgress(8);
    setUploadError(null);
    setResult(null);
    setEditable(null);
    setConfirmErrors(false);

    const progressTimer = window.setInterval(() => {
      setProgress((prev) => Math.min(92, prev + 7));
    }, 250);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("business_id", businessProfile.id);
      if (selectedItemId) {
        form.append("compliance_item_id", selectedItemId);
      }

      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await response.json()) as UploadResponse | { error: string };
      if (!response.ok || !("success" in data)) {
        throw new Error("error" in data ? data.error : "Upload failed");
      }

      setResult(data);
      setEditable(data.extracted_data);
      setProgress(100);

      localStorage.setItem(
        "cc_latest_risk_snapshot",
        JSON.stringify({
          business_id: businessProfile.id,
          old_score: data.old_score,
          new_score: data.new_score,
          updated_at: new Date().toISOString(),
        }),
      );
      window.dispatchEvent(new Event("compliance-risk-updated"));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      setProgress(0);
    } finally {
      window.clearInterval(progressTimer);
      setLoading(false);
    }
  };

  const updateField = (key: keyof ExtractedData, value: string): void => {
    setEditable((prev) => {
      if (!prev) return prev;
      if (key === "amount" || key === "total_amount" || key === "tax_amount") {
        return { ...prev, [key]: toNumberOrNull(value) };
      }
      return { ...prev, [key]: value || null };
    });
  };

  const hasBlockingErrors = result?.anomaly_flags.some((flag) => flag.severity === "error") ?? false;
  const canGenerate = Boolean(result && editable && (!hasBlockingErrors || confirmErrors));
  const authority = editable?.authority ?? "Unknown";
  const handleGenerateSsm = async (): Promise<void> => {
    if (!businessProfile || !editable || !canGenerate) return;
    setDownloading("ssm");
    try {
      const res = await fetch("/api/forms/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "ssm",
          business_id: businessProfile.id,
          fields: {
            nama_perniagaan: editable.company_name || "",
            alamat: "",
            no_mykad: editable.reg_no || "",
            no_telefon: "",
            jenis_perniagaan: businessProfile.type || "",
            company_name: editable.company_name || "",
            tax_ref_no: editable.reg_no || "",
            estimated_tax_payable: String(editable.amount ?? ""),
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to generate SSM form" }));
        throw new Error((err as { error?: string }).error ?? "Failed to generate SSM form");
      }
      const blob = await res.blob();
      const name = `LULUSAI_SSM_BorangA_${Date.now()}.pdf`;
      downloadBlob(blob, name);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to generate SSM form");
    } finally {
      setDownloading(null);
    }
  };

  const handleGenerateLhdn = async (): Promise<void> => {
    if (!businessProfile || !editable || !canGenerate) return;
    setDownloading("lhdn-cp204");
    try {
      const res = await fetch("/api/forms/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "lhdn-cp204",
          business_id: businessProfile.id,
          fields: {
            nama_perniagaan: editable.company_name || "",
            alamat: "",
            no_mykad: editable.reg_no || "",
            no_telefon: "",
            jenis_perniagaan: businessProfile.type || "",
            company_name: editable.company_name || "",
            tax_ref_no: editable.reg_no || "",
            estimated_tax_payable: String(editable.amount ?? ""),
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to generate LHDN CP204" }));
        throw new Error((err as { error?: string }).error ?? "Failed to generate LHDN CP204");
      }
      const blob = await res.blob();
      downloadBlob(blob, `LULUSAI_LHDN_CP204_${Date.now()}.pdf`);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to generate LHDN CP204");
    } finally {
      setDownloading(null);
    }
  };

  const fieldClass = "h-10 border-neutral-700 bg-neutral-900 text-neutral-100";
  const prefilledClass = "border-l-[3px] border-l-emerald-500 bg-emerald-950/20";

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Card className="border-neutral-800 bg-neutral-950">
        <CardHeader>
          <CardTitle className="text-white">Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900 p-8 text-center transition hover:border-neutral-500"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onSelectFile(e.dataTransfer.files[0] ?? null);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <p className="text-base text-neutral-200">Drag and drop PDF/JPG/PNG here</p>
            <p className="text-sm text-neutral-400">or click to browse</p>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {file ? <p className="text-sm text-neutral-300">Selected file: {file.name}</p> : null}
          {choices.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs text-neutral-400">Link this document to compliance item</p>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100"
              >
                {choices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.authority ?? "Unknown"})
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={!file || loading} onClick={runUpload}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Gemini is reading your document...
              </span>
            ) : (
              "Analyse Document"
            )}
          </Button>
          {(loading || progress > 0) && <Progress value={progress} className="bg-neutral-800" />}
          {uploadError ? <p className="text-sm text-red-400">{uploadError}</p> : null}
        </CardContent>
      </Card>

      {result && editable ? (
        <Card className="border-neutral-800 bg-neutral-950">
          <CardHeader>
            <CardTitle className="text-white">OCR Result Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Document type</p>
                <Input value={toInputValue(editable.document_type)} className={`${fieldClass} ${prefilledClass}`} onChange={(e) => updateField("document_type", e.target.value)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Authority</p>
                <Input value={toInputValue(editable.authority)} className={`${fieldClass} ${prefilledClass}`} onChange={(e) => updateField("authority", e.target.value)} />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Company name</p>
                <Input
                  value={toInputValue(editable.company_name)}
                  placeholder="Fill in manually"
                  className={`${fieldClass} ${editable.company_name ? prefilledClass : ""}`}
                  onChange={(e) => updateField("company_name", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Registration/TIN no.</p>
                <Input
                  value={toInputValue(editable.reg_no)}
                  placeholder="Fill in manually"
                  className={`${fieldClass} ${editable.reg_no ? prefilledClass : ""}`}
                  onChange={(e) => updateField("reg_no", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Issue date</p>
                <Input
                  value={toInputValue(editable.issue_date)}
                  placeholder="YYYY-MM-DD"
                  className={`${fieldClass} ${editable.issue_date ? prefilledClass : ""}`}
                  onChange={(e) => updateField("issue_date", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Expiry date</p>
                <Input
                  value={toInputValue(editable.expiry_date)}
                  placeholder="YYYY-MM-DD"
                  className={`${fieldClass} ${editable.expiry_date ? prefilledClass : ""}`}
                  onChange={(e) => updateField("expiry_date", e.target.value)}
                />
              </div>

              {authority === "LHDN" || authority === "Unknown" ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Invoice no.</p>
                    <Input
                      value={toInputValue(editable.invoice_no)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.invoice_no ? prefilledClass : ""}`}
                      onChange={(e) => updateField("invoice_no", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Amount (RM)</p>
                    <Input
                      value={toInputValue(editable.amount)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.amount !== null ? prefilledClass : ""}`}
                      onChange={(e) => updateField("amount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Tax amount (RM)</p>
                    <Input
                      value={toInputValue(editable.tax_amount)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.tax_amount !== null ? prefilledClass : ""}`}
                      onChange={(e) => updateField("tax_amount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Total amount (RM)</p>
                    <Input
                      value={toInputValue(editable.total_amount)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.total_amount !== null ? prefilledClass : ""}`}
                      onChange={(e) => updateField("total_amount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Supplier name</p>
                    <Input
                      value={toInputValue(editable.supplier_name)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.supplier_name ? prefilledClass : ""}`}
                      onChange={(e) => updateField("supplier_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Supplier TIN</p>
                    <Input
                      value={toInputValue(editable.supplier_tin)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.supplier_tin ? prefilledClass : ""}`}
                      onChange={(e) => updateField("supplier_tin", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">MSIC code</p>
                    <Input
                      value={toInputValue(editable.msic_code)}
                      placeholder="Fill in manually"
                      className={`${fieldClass} ${editable.msic_code ? prefilledClass : ""}`}
                      onChange={(e) => updateField("msic_code", e.target.value)}
                    />
                  </div>
                </>
              ) : null}
            </div>

            {result.anomaly_flags.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-200">Anomaly Flags</p>
                <div className="flex flex-wrap gap-2">
                  {result.anomaly_flags.map((flag) => (
                    <Badge
                      key={`${flag.code}-${flag.message}`}
                      className={
                        flag.severity === "error"
                          ? "border border-red-700 bg-red-950/40 text-red-300"
                          : "border border-amber-700 bg-amber-950/40 text-amber-300"
                      }
                    >
                      {flag.severity === "error" ? <TriangleAlert className="mr-1 h-3 w-3" /> : null}
                      {flag.message}
                    </Badge>
                  ))}
                </div>
                {hasBlockingErrors ? (
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      type="checkbox"
                      checked={confirmErrors}
                      onChange={(e) => setConfirmErrors(e.target.checked)}
                      className="h-4 w-4 accent-amber-500"
                    />
                    I understand the error flags and still want to proceed
                  </label>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {displayScore ? (
        <Card className="border-emerald-800 bg-emerald-950/30">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-lg font-semibold">Risk dropped from {displayScore.from} to {displayScore.to}</p>
            </div>
            <p className="text-sm text-emerald-200">
              Penalty exposure now {formatRM(result?.penalty_exposure ?? 0)}
            </p>
            <p className="text-sm text-emerald-200">
              Score dropped by {result?.score_dropped_by ?? 0} points
            </p>
          </CardContent>
        </Card>
      ) : null}

      {result && editable ? (
        <Card className="border-neutral-800 bg-neutral-950">
          <CardHeader>
            <CardTitle className="text-white">Pre-fill your government forms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-neutral-300">
              Your document data has been extracted. Download a pre-filled draft to review before submitting.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button disabled={!canGenerate || downloading !== null} onClick={handleGenerateSsm} className="bg-blue-600 hover:bg-blue-700">
                {downloading === "ssm" ? "Generating..." : "Download SSM Borang A"}
              </Button>
              <Button disabled={!canGenerate || downloading !== null} onClick={handleGenerateLhdn} className="bg-violet-600 hover:bg-violet-700">
                {downloading === "lhdn-cp204" ? "Generating..." : "Download LHDN CP204"}
              </Button>
            </div>
            <p className="text-xs text-neutral-400">
              Pre-filled drafts only. Always verify before submitting to the government portal.
            </p>
            <Button asChild variant="outline" className="border-neutral-700 text-neutral-200">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
