"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const starters = [
  "Apa yang perlu untuk sijil halal JAKIM?",
  "Bila SST saya perlu difailkan?",
  "Bagaimana nak renew SSM?",
  "What documents do I need for EPF?",
];

export default function ChatPage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<"bm" | "en">("bm");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (q: string): Promise<void> => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;

    const userMessage: Message = { role: "user", text: q };
    setMessages((m) => [...m, userMessage, { role: "assistant", text: "" }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: q, businessId, language }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        const chunk = decoder.decode(result.value ?? new Uint8Array());
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            last.text += chunk;
          }
          return copy;
        });
      }
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>AI Compliance Assistant</CardTitle>
            <Tabs value={language} onValueChange={(v) => setLanguage(v as "bm" | "en")}>
              <TabsList>
                <TabsTrigger value="bm">BM</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {starters.map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => ask(s)}>{s}</Button>
            ))}
          </div>

          <div className="h-[420px] space-y-3 overflow-y-auto rounded-md border p-3">
            {messages.map((m, idx) => (
              <div key={`${m.role}-${idx}`} className={`max-w-[85%] rounded-lg p-3 text-sm ${m.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-100"}`}>
                {m.text || "..."}
                {m.role === "assistant" ? <p className="mt-1 text-xs text-slate-500">(Source: LHDN - SST Guide, page 12)</p> : null}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a compliance question..." />
            <Button disabled={!question || loading} onClick={() => ask(question)}>{loading ? "Thinking..." : "Send"}</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}