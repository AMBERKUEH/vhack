import type { Metadata } from "next";
import "./globals.css";
import { AuroraBackgroundWrapper } from "./aurora-wrapper";

export const metadata: Metadata = {
  title: "Compliance Copilot v2",
  description: "AI-powered compliance intelligence for Malaysian SMEs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="dark">
        <AuroraBackgroundWrapper>
          {children}
        </AuroraBackgroundWrapper>
      </body>
    </html>
  );
}