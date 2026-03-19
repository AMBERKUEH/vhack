"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { ReactNode } from "react";

export function AuroraBackgroundWrapper({ children }: { children: ReactNode }) {
  return (
    <AuroraBackground>
      {children}
    </AuroraBackground>
  );
}
