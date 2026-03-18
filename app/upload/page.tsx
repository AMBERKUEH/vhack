"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function UploadPage(): JSX.Element {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ extracted_data: Record<string, string>; anomaly_flags: Array<{ issue: string }> } | null>(null);

  const onUpload = async (): Promise<void> => {
    if (!file) return;

    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;

    const form = new FormData();
    form.append("file", file);
    form.append("businessId", businessId);

    setLoading(true);
    setProgress(20);

    const timer = setInterval(() => setProgress((p) => Math.min(90, p + 8)), 200);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      setResult(data as { extracted_data: Record<string, string>; anomaly_flags: Array<{ issue: string }> });
      setProgress(100);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
      <Card>
        <CardHeader><CardTitle>Upload Document</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed p-10 text-center"
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files[0];
              if (dropped) setFile(dropped);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
          >
            <p>Drag and drop PDF/JPG/PNG/HEIC here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.heic"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          {file ? <p className="text-sm">Selected: {file.name}</p> : null}
          <Button onClick={onUpload} disabled={!file || loading}>{loading ? "Uploading..." : "Upload"}</Button>
          {loading || progress > 0 ? <Progress value={progress} /> : null}
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader><CardTitle>Extracted Fields</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p>Document type: {result.extracted_data.document_type}</p>
            <p>Company name: {result.extracted_data.company_name}</p>
            <p>Reg no: {result.extracted_data.reg_no}</p>
            <p>Expiry date: {result.extracted_data.expiry_date}</p>
            <p>Authority: {result.extracted_data.issuing_authority}</p>
            <div className="flex flex-wrap gap-2">
              {result.anomaly_flags?.map((flag) => (
                <Badge key={flag.issue} variant="warning">{flag.issue}</Badge>
              ))}
            </div>
            <Button onClick={() => router.push("/dashboard")}>Confirm & Save</Button>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}