"use client";

import { useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TaxType = "SST 6%" | "SST 0%" | "Exempt" | "None";

const TAX_RATES: Record<TaxType, number> = {
  "SST 6%": 0.06,
  "SST 0%": 0,
  Exempt: 0,
  None: 0,
};

type ReceiptLineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type: TaxType;
  tax_rate: number;
  tax_amount: number;
  total: number;
};

type ReceiptFields = {
  supplier_name: string;
  supplier_tin: string;
  supplier_reg_no: string;
  supplier_msic: string;
  supplier_address: string;
  supplier_phone: string;
  supplier_email: string;
  buyer_name: string;
  buyer_tin: string;
  buyer_reg_no: string;
  buyer_address: string;
  invoice_number: string;
  invoice_date: string;
  invoice_time: string;
  currency: string;
  exchange_rate: string;
  line_items: ReceiptLineItem[];
  subtotal: number;
  tax_total: number;
  grand_total: number;
};

type ExtractedLineItem = Partial<ReceiptLineItem>;
type ExtractedFields = Partial<Omit<ReceiptFields, "line_items">> & { line_items?: ExtractedLineItem[] };

type ExtractResponse = {
  success: boolean;
  extracted: ExtractedFields;
  confidence: "high" | "medium" | "low";
};

function createLineItem(): ReceiptLineItem {
  return {
    description: "",
    quantity: 1,
    unit_price: 0,
    tax_type: "SST 6%",
    tax_rate: TAX_RATES["SST 6%"],
    tax_amount: 0,
    total: 0,
  };
}

function normalizeTaxType(input: string): TaxType {
  if (input === "SST 0%") return "SST 0%";
  if (input === "Exempt") return "Exempt";
  if (input === "None") return "None";
  return "SST 6%";
}

function toFiniteNumber(input: unknown, fallback: number): number {
  const num = typeof input === "number" ? input : Number(input);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeLine(item: Partial<ReceiptLineItem>): ReceiptLineItem {
  const quantity = Math.max(0, toFiniteNumber(item.quantity, 1));
  const unitPrice = Math.max(0, toFiniteNumber(item.unit_price, 0));
  const taxType = normalizeTaxType(String(item.tax_type ?? "SST 6%"));
  const taxRate = TAX_RATES[taxType];
  const lineTotal = quantity * unitPrice;
  const taxAmount = lineTotal * taxRate;

  return {
    description: String(item.description ?? ""),
    quantity,
    unit_price: unitPrice,
    tax_type: taxType,
    tax_rate: taxRate,
    tax_amount: Number(taxAmount.toFixed(2)),
    total: Number((lineTotal + taxAmount).toFixed(2)),
  };
}

function recalc(fields: ReceiptFields): ReceiptFields {
  const lines = (fields.line_items.length > 0 ? fields.line_items : [createLineItem()]).map(normalizeLine);
  const subtotal = Number(lines.reduce((sum, line) => sum + line.quantity * line.unit_price, 0).toFixed(2));
  const taxTotal = Number(lines.reduce((sum, line) => sum + line.tax_amount, 0).toFixed(2));
  const grandTotal = Number((subtotal + taxTotal).toFixed(2));
  return {
    ...fields,
    line_items: lines,
    subtotal,
    tax_total: taxTotal,
    grand_total: grandTotal,
  };
}

function toInitialFields(extracted: ExtractedFields): ReceiptFields {
  const lines = (extracted.line_items && extracted.line_items.length > 0 ? extracted.line_items : [createLineItem()]).map(normalizeLine);
  return recalc({
    supplier_name: extracted.supplier_name ?? "",
    supplier_tin: extracted.supplier_tin ?? "",
    supplier_reg_no: extracted.supplier_reg_no ?? "",
    supplier_msic: extracted.supplier_msic ?? "",
    supplier_address: extracted.supplier_address ?? "",
    supplier_phone: extracted.supplier_phone ?? "",
    supplier_email: extracted.supplier_email ?? "",
    buyer_name: extracted.buyer_name ?? "",
    buyer_tin: extracted.buyer_tin ?? "",
    buyer_reg_no: extracted.buyer_reg_no ?? "",
    buyer_address: extracted.buyer_address ?? "",
    invoice_number: extracted.invoice_number ?? "",
    invoice_date: extracted.invoice_date ?? "",
    invoice_time: extracted.invoice_time ?? "",
    currency: extracted.currency || "MYR",
    exchange_rate: extracted.exchange_rate || "1.0",
    line_items: lines,
    subtotal: toFiniteNumber(extracted.subtotal, 0),
    tax_total: toFiniteNumber(extracted.tax_total, 0),
    grand_total: toFiniteNumber(extracted.grand_total, 0),
  });
}

function fileToDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ReceiptToMyInvoisTab(): JSX.Element {
  const receiptFileRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [reviewedFields, setReviewedFields] = useState<ReceiptFields | null>(null);
  const [prefilledKeys, setPrefilledKeys] = useState<Set<string>>(new Set());
  const [jsonLoading, setJsonLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [validateRequired, setValidateRequired] = useState(false);

  const missingRequired = useMemo(() => {
    if (!reviewedFields) return true;
    if (!reviewedFields.supplier_name.trim()) return true;
    if (!reviewedFields.buyer_name.trim()) return true;
    if (!reviewedFields.invoice_number.trim()) return true;
    if (!reviewedFields.invoice_date.trim()) return true;
    return reviewedFields.line_items.some(
      (line) => !line.description.trim() || line.quantity <= 0 || line.unit_price < 0,
    );
  }, [reviewedFields]);

  const setField = <K extends keyof ReceiptFields>(key: K, value: ReceiptFields[K]): void => {
    setReviewedFields((prev) => (prev ? recalc({ ...prev, [key]: value }) : prev));
  };

  const updateLine = (index: number, key: keyof ReceiptLineItem, value: string): void => {
    setReviewedFields((prev) => {
      if (!prev) return prev;
      const lines = [...prev.line_items];
      const line = { ...lines[index] };

      if (key === "quantity" || key === "unit_price") {
        line[key] = Math.max(0, toFiniteNumber(value, 0));
      } else if (key === "tax_type") {
        line.tax_type = normalizeTaxType(value);
      } else if (key === "description") {
        line.description = value;
      } else {
        line[key] = line[key];
      }

      lines[index] = normalizeLine(line);
      return recalc({ ...prev, line_items: lines });
    });
  };

  const fieldInputClass = (fieldName: string, value: string, required = false): string => {
    const base = "h-10 bg-neutral-900 text-neutral-100";
    const requiredError = required && validateRequired && !value.trim() ? "border-red-500" : "border-neutral-700";
    const prefilled = prefilledKeys.has(fieldName) ? "border-l-[3px] border-l-emerald-500 bg-emerald-950/20" : "";
    return `${base} ${requiredError} ${prefilled}`;
  };

  const lineFieldClass = (fieldName: string, requiredInvalid: boolean): string => {
    const base = "h-10 bg-neutral-900 text-neutral-100";
    const requiredError = validateRequired && requiredInvalid ? "border-red-500" : "border-neutral-700";
    const prefilled = prefilledKeys.has(fieldName) ? "border-l-[3px] border-l-emerald-500 bg-emerald-950/20" : "";
    return `${base} ${requiredError} ${prefilled}`;
  };

  const handleExtractReceipt = async (): Promise<void> => {
    if (!receiptFile) {
      setReceiptError("Please upload a receipt first.");
      return;
    }

    setExtracting(true);
    setReceiptError(null);
    setValidateRequired(false);

    try {
      const formData = new FormData();
      formData.append("file", receiptFile);

      const response = await fetch("/api/receipt/extract", { method: "POST", body: formData });
      const payload = (await response.json()) as ExtractResponse | { error: string };

      if (!response.ok || !("success" in payload)) {
        throw new Error("error" in payload ? payload.error : "Failed to extract receipt.");
      }

      const extracted = payload.extracted;
      const nextPrefilled = new Set<string>();
      Object.entries(extracted).forEach(([key, value]) => {
        if (key === "line_items") return;
        if (typeof value === "string" && value.trim()) nextPrefilled.add(key);
        if (typeof value === "number" && Number.isFinite(value)) nextPrefilled.add(key);
      });
      (extracted.line_items ?? []).forEach((line, index) => {
        if ((line.description ?? "").trim()) nextPrefilled.add(`line_items.${index}.description`);
        if (Number.isFinite(line.quantity ?? NaN)) nextPrefilled.add(`line_items.${index}.quantity`);
        if (Number.isFinite(line.unit_price ?? NaN)) nextPrefilled.add(`line_items.${index}.unit_price`);
        if ((line.tax_type ?? "").trim()) nextPrefilled.add(`line_items.${index}.tax_type`);
      });

      setPrefilledKeys(nextPrefilled);
      setReviewedFields(toInitialFields(extracted));
    } catch (error) {
      setReceiptError(error instanceof Error ? error.message : "Failed to extract receipt.");
      setReviewedFields(null);
      setPrefilledKeys(new Set());
    } finally {
      setExtracting(false);
    }
  };

  const validateBeforeDownload = (): boolean => {
    setValidateRequired(true);
    if (missingRequired) {
      setReceiptError("Please fill all required fields (*) before downloading.");
      return false;
    }
    setReceiptError(null);
    return true;
  };

  const handleDownloadJson = async (): Promise<void> => {
    if (!reviewedFields || !validateBeforeDownload()) return;
    setJsonLoading(true);
    try {
      const response = await fetch("/api/receipt/generate-myinvois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: reviewedFields }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ error: "Failed to generate MyInvois JSON" }))) as {
          error?: string;
        };
        throw new Error(payload.error ?? "Failed to generate MyInvois JSON");
      }

      const blob = await response.blob();
      fileToDownload(blob, `MyInvois_${reviewedFields.invoice_number || "draft"}_${Date.now()}.json`);
    } catch (error) {
      setReceiptError(error instanceof Error ? error.message : "Failed to generate MyInvois JSON.");
    } finally {
      setJsonLoading(false);
    }
  };

  const handleDownloadPdf = async (): Promise<void> => {
    if (!reviewedFields || !validateBeforeDownload()) return;
    setPdfLoading(true);
    try {
      const response = await fetch("/api/receipt/generate-invoice-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: reviewedFields }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ error: "Failed to generate invoice PDF" }))) as {
          error?: string;
        };
        throw new Error(payload.error ?? "Failed to generate invoice PDF");
      }

      const blob = await response.blob();
      fileToDownload(blob, `Invoice_${reviewedFields.invoice_number || "draft"}_${Date.now()}.pdf`);
    } catch (error) {
      setReceiptError(error instanceof Error ? error.message : "Failed to generate invoice PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      <Card className="border-neutral-800 bg-neutral-950">
        <CardHeader>
          <CardTitle className="text-white">Receipt to MyInvois</CardTitle>
          <p className="text-sm text-neutral-400">
            Upload any receipt - handwritten, printed, or photo. We extract the details and generate a
            LHDN-compliant e-Invoice in seconds.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900 p-8 text-center transition hover:border-neutral-500"
            onClick={() => receiptFileRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setReceiptFile(event.dataTransfer.files[0] ?? null);
              setReceiptError(null);
            }}
          >
            <p className="text-base text-neutral-200">Upload your receipt</p>
            <p className="text-sm text-neutral-400">
              Works with handwritten receipts, thermal paper, photos, and scanned PDFs
            </p>
            <input
              ref={receiptFileRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.webp,image/jpeg,image/png,image/webp,application/pdf"
              onChange={(event) => {
                setReceiptFile(event.target.files?.[0] ?? null);
                setReceiptError(null);
              }}
            />
          </div>
          {receiptFile ? <p className="text-sm text-neutral-300">Selected file: {receiptFile.name}</p> : null}
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={!receiptFile || extracting} onClick={handleExtractReceipt}>
            {extracting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading your receipt...
              </span>
            ) : (
              "Extract Receipt"
            )}
          </Button>
          {receiptError ? <p className="text-sm text-red-400">{receiptError}</p> : null}
        </CardContent>
      </Card>

      {reviewedFields ? (
        <Card className="border-neutral-800 bg-neutral-950">
          <CardHeader>
            <CardTitle className="text-white">We found these details - please review and correct if needed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <section className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Supplier Information</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  className={fieldInputClass("supplier_name", reviewedFields.supplier_name, true)}
                  placeholder="Supplier Name *"
                  value={reviewedFields.supplier_name}
                  onChange={(event) => setField("supplier_name", event.target.value)}
                />
                <Input
                  className={fieldInputClass("supplier_tin", reviewedFields.supplier_tin)}
                  placeholder="Supplier TIN (Tax Identification Number)"
                  value={reviewedFields.supplier_tin}
                  onChange={(event) => setField("supplier_tin", event.target.value)}
                />
                <Input
                  className={fieldInputClass("supplier_reg_no", reviewedFields.supplier_reg_no)}
                  placeholder="Supplier Registration No (SSM)"
                  value={reviewedFields.supplier_reg_no}
                  onChange={(event) => setField("supplier_reg_no", event.target.value)}
                />
                <Input
                  className={fieldInputClass("supplier_msic", reviewedFields.supplier_msic)}
                  placeholder="Supplier MSIC Code"
                  value={reviewedFields.supplier_msic}
                  onChange={(event) => setField("supplier_msic", event.target.value)}
                />
                <Input
                  className={`md:col-span-2 ${fieldInputClass("supplier_address", reviewedFields.supplier_address)}`}
                  placeholder="Supplier Address"
                  value={reviewedFields.supplier_address}
                  onChange={(event) => setField("supplier_address", event.target.value)}
                />
                <Input
                  className={fieldInputClass("supplier_phone", reviewedFields.supplier_phone)}
                  placeholder="Supplier Phone"
                  value={reviewedFields.supplier_phone}
                  onChange={(event) => setField("supplier_phone", event.target.value)}
                />
                <Input
                  className={fieldInputClass("supplier_email", reviewedFields.supplier_email)}
                  placeholder="Supplier Email"
                  value={reviewedFields.supplier_email}
                  onChange={(event) => setField("supplier_email", event.target.value)}
                />
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Buyer Information</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  className={fieldInputClass("buyer_name", reviewedFields.buyer_name, true)}
                  placeholder="Buyer Name *"
                  value={reviewedFields.buyer_name}
                  onChange={(event) => setField("buyer_name", event.target.value)}
                />
                <Input
                  className={fieldInputClass("buyer_tin", reviewedFields.buyer_tin)}
                  placeholder="Buyer TIN"
                  value={reviewedFields.buyer_tin}
                  onChange={(event) => setField("buyer_tin", event.target.value)}
                />
                <Input
                  className={fieldInputClass("buyer_reg_no", reviewedFields.buyer_reg_no)}
                  placeholder="Buyer Registration No"
                  value={reviewedFields.buyer_reg_no}
                  onChange={(event) => setField("buyer_reg_no", event.target.value)}
                />
                <Input
                  className={fieldInputClass("buyer_address", reviewedFields.buyer_address)}
                  placeholder="Buyer Address"
                  value={reviewedFields.buyer_address}
                  onChange={(event) => setField("buyer_address", event.target.value)}
                />
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Invoice Details</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  className={fieldInputClass("invoice_number", reviewedFields.invoice_number, true)}
                  placeholder="Invoice Number *"
                  value={reviewedFields.invoice_number}
                  onChange={(event) => setField("invoice_number", event.target.value)}
                />
                <Input
                  className={fieldInputClass("invoice_date", reviewedFields.invoice_date, true)}
                  type="date"
                  value={reviewedFields.invoice_date}
                  onChange={(event) => setField("invoice_date", event.target.value)}
                />
                <Input
                  className={fieldInputClass("invoice_time", reviewedFields.invoice_time)}
                  placeholder="Invoice Time"
                  value={reviewedFields.invoice_time}
                  onChange={(event) => setField("invoice_time", event.target.value)}
                />
                <Input
                  className={fieldInputClass("currency", reviewedFields.currency)}
                  placeholder="Currency"
                  value={reviewedFields.currency}
                  onChange={(event) => setField("currency", event.target.value)}
                />
                <Input
                  className={fieldInputClass("exchange_rate", reviewedFields.exchange_rate)}
                  placeholder="Exchange Rate"
                  value={reviewedFields.exchange_rate}
                  onChange={(event) => setField("exchange_rate", event.target.value)}
                />
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-neutral-400">Line Items</p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-700 text-neutral-200"
                  onClick={() =>
                    setReviewedFields((prev) =>
                      prev ? recalc({ ...prev, line_items: [...prev.line_items, createLineItem()] }) : prev,
                    )
                  }
                >
                  + Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {reviewedFields.line_items.map((line, index) => (
                  <div key={`line-${index}`} className="rounded-md border border-neutral-800 bg-neutral-900/70 p-3">
                    <div className="grid gap-2 md:grid-cols-6">
                      <Input
                        className={`md:col-span-2 ${lineFieldClass(
                          `line_items.${index}.description`,
                          !line.description.trim(),
                        )}`}
                        placeholder="Description *"
                        value={line.description}
                        onChange={(event) => updateLine(index, "description", event.target.value)}
                      />
                      <Input
                        className={lineFieldClass(`line_items.${index}.quantity`, line.quantity <= 0)}
                        type="number"
                        min="0"
                        placeholder="Quantity *"
                        value={line.quantity}
                        onChange={(event) => updateLine(index, "quantity", event.target.value)}
                      />
                      <Input
                        className={lineFieldClass(`line_items.${index}.unit_price`, line.unit_price < 0)}
                        type="number"
                        min="0"
                        placeholder="Unit Price (RM) *"
                        value={line.unit_price}
                        onChange={(event) => updateLine(index, "unit_price", event.target.value)}
                      />
                      <select
                        className={`h-10 rounded-md px-3 text-sm ${lineFieldClass(
                          `line_items.${index}.tax_type`,
                          false,
                        )}`}
                        value={line.tax_type}
                        onChange={(event) => updateLine(index, "tax_type", event.target.value)}
                      >
                        <option value="SST 6%">SST 6%</option>
                        <option value="SST 0%">SST 0%</option>
                        <option value="Exempt">Exempt</option>
                        <option value="None">None</option>
                      </select>
                      <div className="flex h-10 items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 text-sm text-neutral-300">
                        Tax: RM {line.tax_amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-neutral-400">Total: RM {line.total.toFixed(2)}</p>
                      {reviewedFields.line_items.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-300 hover:bg-red-950/30"
                          onClick={() =>
                            setReviewedFields((prev) =>
                              prev
                                ? recalc({
                                    ...prev,
                                    line_items: prev.line_items.filter((_, itemIndex) => itemIndex !== index),
                                  })
                                : prev,
                            )
                          }
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-neutral-800 bg-neutral-900/60 p-4 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>Subtotal:</span>
                <span>RM {reviewedFields.subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex justify-between text-neutral-300">
                <span>Tax Total:</span>
                <span>RM {reviewedFields.tax_total.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between text-base font-semibold text-white">
                <span>Grand Total:</span>
                <span>RM {reviewedFields.grand_total.toFixed(2)}</span>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={jsonLoading || pdfLoading} onClick={handleDownloadJson}>
                {jsonLoading ? "Generating..." : "Download MyInvois JSON"}
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-700" disabled={jsonLoading || pdfLoading} onClick={handleDownloadPdf}>
                {pdfLoading ? "Generating..." : "Download Invoice PDF"}
              </Button>
            </div>

            <p className="text-xs text-neutral-400">
              This is a draft e-Invoice. Verify all TIN numbers and amounts before submitting to LHDN MyInvois portal
              at myinvois.hasil.gov.my
            </p>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
