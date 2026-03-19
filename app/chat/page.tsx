"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";

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

const translations: Record<string, Record<string, string>> = {
  "Apa yang perlu untuk sijil halal JAKIM?": {
    bm: "Apa yang perlu untuk sijil halal JAKIM?",
    en: "What is needed for JAKIM halal certificate?",
  },
  "Bila SST saya perlu difailkan?": {
    bm: "Bila SST saya perlu difailkan?",
    en: "When do I need to file SST?",
  },
  "Bagaimana nak renew SSM?": {
    bm: "Bagaimana nak renew SSM?",
    en: "How to renew SSM?",
  },
  "What documents do I need for EPF?": {
    bm: "Dokumen apa yang saya perlukan untuk EPF?",
    en: "What documents do I need for EPF?",
  },
};

export default function ChatPage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<"bm" | "en">("bm");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const assistantTextRef = useRef<string>("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (q: string): Promise<void> => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;

    const userMessage: Message = { role: "user", text: q };
    assistantTextRef.current = "";
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
        const chunk = decoder.decode(result.value ?? new Uint8Array(), { stream: true });
        
        if (chunk) {
          assistantTextRef.current += chunk;
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant") {
              last.text = assistantTextRef.current;
            }
            return copy;
          });
        }
      }
    }

    setLoading(false);
    setQuestion("");
  };

  // Extract source citation from message text
  const parseMessage = (text: string) => {
    const sourceMatch = text.match(/\(Sumber \/ Source: ([^)]+)\)/);
    if (sourceMatch) {
      return {
        text: text.replace(/\(Sumber \/ Source: [^)]+\)/, "").trim(),
        source: sourceMatch[1],
      };
    }
    return { text, source: null };
  };

  const getStarterText = (s: string) => {
    return translations[s]?.[language] || s;
  };

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-white">AI Compliance Assistant</CardTitle>
            <Tabs value={language} onValueChange={(v) => setLanguage(v as "bm" | "en")}>
              <TabsList className="bg-neutral-800">
                <TabsTrigger value="bm" className="data-[state=active]:bg-neutral-700">BM</TabsTrigger>
                <TabsTrigger value="en" className="data-[state=active]:bg-neutral-700">English</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Starter Questions - Rounded Full Pills */}
          <div className="flex flex-wrap gap-2">
            {starters.map((s) => (
              <PromptSuggestion 
                key={s}
                onClick={() => ask(getStarterText(s))}
                className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white hover:border-neutral-600"
              >
                {getStarterText(s)}
              </PromptSuggestion>
            ))}
          </div>

          {/* Messages */}
          <div className="h-[320px] space-y-3 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-950 p-3">
            {messages.map((m, idx) => {
              const parsed = m.role === "assistant" ? parseMessage(m.text) : { text: m.text, source: null };
              return (
                <div key={`${m.role}-${idx}`} className={`max-w-[85%] rounded-lg p-3 text-sm ${m.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-neutral-800 text-neutral-200"}`}>
                  <div className="whitespace-pre-wrap">{parsed.text || "..."}</div>
                  {parsed.source ? <p className="mt-2 text-xs text-neutral-500 italic">Source: {parsed.source}</p> : null}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Simple Chat Input */}
          <div className="flex gap-2">
            <Input 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              placeholder={language === "bm" ? "Tanya soalan pematuhan..." : "Ask a compliance question..."}
              className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (question.trim()) ask(question);
                }
              }}
            />
            <Button 
              disabled={!question || loading} 
              onClick={() => ask(question)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (language === "bm" ? "Berfikir..." : "Thinking...") : (language === "bm" ? "Hantar" : "Send")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}