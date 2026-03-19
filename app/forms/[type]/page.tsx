"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormField = { id: string; label: string; label_bm: string; type: string; value?: string; required: boolean };

export default function FormAutofillPage(): JSX.Element {
  const params = useParams<{ type: string }>();
  const [fields, setFields] = useState<FormField[]>([]);
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;
    fetch(`/api/forms/${params.type}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessId }),
    })
      .then((r) => r.json())
      .then((d) => setFields(d.fields ?? []));
  }, [params.type]);

  const trackingNo = useMemo(
    () => `CC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    [],
  );

  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-10 text-center">
            <p className="text-lg font-semibold text-white">Permohonan anda telah dihantar. No. Rujukan: {submitted}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">Form Autofill: {params.type}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id}>
              <label className="mb-1 block text-sm text-neutral-300">{field.label}</label>
              <Input
                value={field.value ?? ""}
                className={field.value ? "border-purple-500 bg-purple-950/30 text-white" : "bg-neutral-950 border-neutral-800 text-white"}
                onChange={(e) => {
                  const next = [...fields];
                  next[idx] = { ...field, value: e.target.value };
                  setFields(next);
                }}
              />
            </div>
          ))}
          <Button onClick={() => setSubmitted(trackingNo)} className="bg-blue-600 hover:bg-blue-700">Submit (Simulation)</Button>
        </CardContent>
      </Card>
    </main>
  );
}