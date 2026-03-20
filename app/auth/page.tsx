"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, type User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export default function AuthPage(): JSX.Element {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        document.cookie = "cc_auth=1; Path=/; Max-Age=2592000; SameSite=Lax";
        router.replace("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        document.cookie = "cc_auth=1; Path=/; Max-Age=2592000; SameSite=Lax";
        router.replace("/");
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleAuth = async (): Promise<void> => {
    if (!supabase) {
      setAuthError("Supabase env is missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthMessage(null);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword });
        if (error) throw error;
        setAuthMessage("Sign up success. Please verify email if your Supabase project requires confirmation.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
        if (error) throw error;
        document.cookie = "cc_auth=1; Path=/; Max-Age=2592000; SameSite=Lax";
        router.push("/");
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-8">
      <Card className="w-full border-neutral-800 bg-neutral-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-4xl text-white md:text-5xl">Auth</CardTitle>
          <p className="text-center text-base text-neutral-400 md:text-lg">Login or sign up to continue</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <LiquidGlassButton variant={authMode === "login" ? "primary" : "outline"} onClick={() => setAuthMode("login")} className="w-full">
              Login
            </LiquidGlassButton>
            <LiquidGlassButton variant={authMode === "signup" ? "primary" : "outline"} onClick={() => setAuthMode("signup")} className="w-full">
              Sign Up
            </LiquidGlassButton>
          </div>
          <Input
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-12 border-neutral-800 bg-neutral-950 text-base text-white placeholder:text-neutral-500"
          />
          <Input
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            placeholder="Password"
            className="h-12 border-neutral-800 bg-neutral-950 text-base text-white placeholder:text-neutral-500"
          />
          <LiquidGlassButton onClick={handleAuth} disabled={authLoading || !authEmail || !authPassword} className="w-full">
            {authLoading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Login"}
          </LiquidGlassButton>
          {user ? <p className="text-sm text-emerald-400">Logged in as: {user.email}</p> : null}
          {authMessage ? <p className="text-sm text-neutral-300">{authMessage}</p> : null}
          {authError ? <p className="text-sm text-rose-400">{authError}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
