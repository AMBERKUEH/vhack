"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, type User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export default function LandingPage(): JSX.Element {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const [prompt, setPrompt] = useState("Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) router.replace("/auth");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) router.replace("/auth");
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const onSubmit = async (): Promise<void> => {
    if (!user?.email) {
      setError("Please login first.");
      router.push("/auth");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, email: user.email, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Onboarding failed");

      localStorage.setItem("cc_business", JSON.stringify(data.business));
      localStorage.setItem("cc_profile", JSON.stringify(data.business));
      localStorage.setItem("cc_grants", JSON.stringify(data.grant_matches));
      localStorage.setItem("cc_items", JSON.stringify(data.compliance_items));
      localStorage.setItem("compliance_copilot_business_id", data.business.id);
      localStorage.setItem("compliance_copilot_business_name", data.business.name);

      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Card className="w-full border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-center text-3xl text-white md:text-4xl">Compliance Copilot</CardTitle>
          <p className="text-center text-neutral-400">Ceritakan tentang perniagaan anda / Tell us about your business</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-[220px] resize-none rounded-2xl border-neutral-700 bg-neutral-950 text-lg text-white placeholder:text-neutral-500"
            placeholder="Contoh: Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <LiquidGlassButton className="h-12 w-full text-base" onClick={onSubmit} disabled={loading || !user}>
            {loading ? "Memproses..." : "Semak Compliance Saya >"}
          </LiquidGlassButton>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}

