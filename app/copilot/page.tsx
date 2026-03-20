"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, type User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

type Business = {
  id: string;
  name: string;
  type: string;
  location: string;
  state?: string;
  council?: string;
  employees: number;
  channels?: string[];
  product_type?: string;
  language_pref?: "en" | "bm";
  sells_online?: boolean;
  is_food?: boolean;
};

type ExtractResponse = {
  profile: Omit<Business, "id">;
};

const EXAMPLE_PROMPTS = [
  "Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak",
  "I run a kedai runcit in Johor Bahru, sole proprietor, no employees",
  "Butik fesyen online, jual baju kurung, Shopee + website sendiri",
];

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

export default function CopilotPage(): JSX.Element {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<ExtractResponse["profile"] | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (!sessionUser) router.replace("/auth");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (!sessionUser) router.replace("/auth");
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const onAnalyse = async (): Promise<void> => {
    if (!prompt.trim()) {
      setError("Please describe your business first.");
      return;
    }
    if (!user?.email) {
      setError("Please log in first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractRes = await fetch("/api/onboard/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const extractData = (await extractRes.json()) as { error?: string; profile?: ExtractResponse["profile"] };
      if (!extractRes.ok || !extractData.profile) {
        throw new Error(extractData.error ?? "Failed to analyse your business");
      }

      setExtractedProfile(extractData.profile);
      setShowConfirm(true);
    } catch (err) {
      setExtractedProfile(null);
      setShowConfirm(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const confirmProfile = (): void => {
    void (async () => {
      if (!user?.email || !extractedProfile) return;
      setLoading(true);
      setError(null);

      try {
        const onboardRes = await fetch("/api/onboard", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            prompt,
            email: user.email,
            userId: user.id,
            profile: extractedProfile,
          }),
        });

        const onboardData = (await onboardRes.json()) as {
          error?: string;
          business: Business;
          grant_matches: unknown;
          compliance_items: unknown;
        };

        if (!onboardRes.ok) {
          throw new Error(onboardData.error ?? "Onboarding failed");
        }

        localStorage.setItem("cc_business", JSON.stringify(onboardData.business));
        localStorage.setItem("cc_profile", JSON.stringify(onboardData.business));
        localStorage.setItem("cc_grants", JSON.stringify(onboardData.grant_matches));
        localStorage.setItem("cc_items", JSON.stringify(onboardData.compliance_items));
        localStorage.setItem("compliance_copilot_business_id", onboardData.business.id);
        localStorage.setItem("compliance_copilot_business_name", onboardData.business.name);

        setShowConfirm(false);
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  };

  const onEdit = (): void => {
    setShowConfirm(false);
    setExtractedProfile(null);
    setError(null);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-20 pt-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-3 text-center">
          <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl">LULUS AI</h1>
          <p className="text-lg text-neutral-300 md:text-xl">
            Tell us about your business and we&apos;ll build your full compliance picture in seconds.
          </p>
        </header>

        <Card className="border-neutral-800 bg-neutral-900/90">
          <CardContent className="space-y-4 pt-6">
            <Textarea
              className="min-h-[220px] resize-none rounded-2xl border-neutral-700 bg-neutral-950 text-lg text-white placeholder:text-neutral-500"
              placeholder="Ceritakan tentang perniagaan anda / Tell us about your business... e.g. Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              readOnly={loading || showConfirm}
            />

            <div className="space-y-2">
              <p className="text-sm text-neutral-300">Not sure what to write? Click an example:</p>
              <div className="grid gap-2 md:grid-cols-3">
                {EXAMPLE_PROMPTS.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-left text-sm text-neutral-200 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setPrompt(example)}
                    disabled={loading || showConfirm}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
              <p className="mb-2">Tips for best results -- include:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>What your business does (food, retail, services, manufacturing)</li>
                <li>Where you are based (city and state)</li>
                <li>How many employees you have</li>
                <li>Whether you sell online, offline, or both</li>
                <li>What type of product (halal food, clothing, electronics, etc.)</li>
              </ul>
            </div>

            <LiquidGlassButton className="h-12 w-full text-base" onClick={onAnalyse} disabled={loading || !user || showConfirm}>
              {loading ? "Analysing your business..." : "Analyse My Business ->"}
            </LiquidGlassButton>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
                <span>Analysing your business...</span>
              </div>
            ) : null}

            {!user ? <p className="text-sm text-neutral-400">Please login first.</p> : null}
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <div
              className={`rounded-2xl border border-neutral-700 bg-neutral-950 p-4 transition-all duration-300 ${
                showConfirm && extractedProfile ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              <p className="mb-3 text-lg font-semibold text-white">Is this correct?</p>

              {extractedProfile ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-white">
                    {extractedProfile.type}
                  </Badge>
                  {extractedProfile.location ? (
                    <Badge className="rounded-full bg-blue-600 px-3 py-1 text-white">{extractedProfile.location}</Badge>
                  ) : null}
                  <Badge variant="secondary" className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-white">
                    {extractedProfile.employees} employees
                  </Badge>
                  {(extractedProfile.channels ?? []).map((channel) => (
                    <Badge
                      key={channel}
                      variant="secondary"
                      className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-white"
                    >
                      {channel}
                    </Badge>
                  ))}
                  {extractedProfile.product_type ? (
                    <Badge className="rounded-full bg-blue-600 px-3 py-1 text-white">{extractedProfile.product_type}</Badge>
                  ) : null}
                </div>
              ) : null}

              <div className="flex gap-2">
                <LiquidGlassButton className="w-full md:w-auto" onClick={confirmProfile} disabled={loading || !extractedProfile}>
                  Yes, looks right {">"}
                </LiquidGlassButton>
                <LiquidGlassButton variant="outline" className="w-full md:w-auto" onClick={onEdit} disabled={loading}>
                  Edit
                </LiquidGlassButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
