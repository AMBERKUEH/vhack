"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

export default function LandingPage(): JSX.Element {
  const router = useRouter();
  const [prompt, setPrompt] = useState("Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak...");
  const [email, setEmail] = useState("demo@warungmakjah.my");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Onboarding failed");

      localStorage.setItem("cc_business", JSON.stringify(data.business));
      localStorage.setItem("cc_profile", JSON.stringify(data.business));
      localStorage.setItem("cc_grants", JSON.stringify(data.grant_matches));
      localStorage.setItem("cc_items", JSON.stringify(data.compliance_items));
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-center text-3xl md:text-4xl text-white">Compliance Copilot</CardTitle>
          <p className="text-center text-neutral-400">
            Ceritakan tentang perniagaan anda / Tell us about your business
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-[180px] text-base bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500"
            placeholder="Contoh: Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="owner@email.com" 
            className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500"
          />
          <LiquidGlassButton className="w-full" onClick={onSubmit} disabled={loading}>
            {loading ? "Memproses..." : "Semak Compliance Saya >"}
          </LiquidGlassButton>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}