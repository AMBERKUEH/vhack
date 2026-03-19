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
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">Upload Document</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-950 p-10 text-center hover:border-neutral-600"
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files[0];
              if (dropped) setFile(dropped);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
          >
            <p className="text-neutral-300">Drag and drop PDF/JPG/PNG/HEIC here</p>
            <p className="text-sm text-neutral-500">or click to browse</p>
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.heic"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          {file ? <p className="text-sm text-neutral-300">Selected: {file.name}</p> : null}
          <Button onClick={onUpload} disabled={!file || loading} className="bg-blue-600 hover:bg-blue-700">{loading ? "Uploading..." : "Upload"}</Button>
          {loading || progress > 0 ? <Progress value={progress} className="bg-neutral-800" /> : null}
        </CardContent>
      </Card>

      {result ? (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader><CardTitle className="text-white">Extracted Fields</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-neutral-300">Document type: {result.extracted_data.document_type}</p>
            <p className="text-neutral-300">Company name: {result.extracted_data.company_name}</p>
            <p className="text-neutral-300">Reg no: {result.extracted_data.reg_no}</p>
            <p className="text-neutral-300">Expiry date: {result.extracted_data.expiry_date}</p>
            <p className="text-neutral-300">Authority: {result.extracted_data.issuing_authority}</p>
            <div className="flex flex-wrap gap-2">
              {result.anomaly_flags?.map((flag) => (
                <Badge key={flag.issue} variant="warning" className="bg-amber-900/50 text-amber-300 border-amber-800">{flag.issue}</Badge>
              ))}
            </div>
            <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">Confirm & Save</Button>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}