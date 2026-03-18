import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compliance Copilot v2",
  description: "AI-powered compliance intelligence for Malaysian SMEs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}