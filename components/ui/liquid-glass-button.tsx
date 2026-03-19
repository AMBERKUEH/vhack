"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LiquidGlassButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function LiquidGlassButton({
  className,
  children,
  onClick,
  type = "button",
  disabled = false,
  id,
  ariaLabel,
  variant = "primary",
}: LiquidGlassButtonProps) {
  const baseStyles =
    "group relative inline-flex items-center justify-center cursor-pointer select-none rounded-full px-8 py-3 font-medium transition-all duration-500 ease-out";

  const variantStyles = {
    primary: cn(
      // Base glass effect
      "bg-gradient-to-b from-white/10 to-white/5",
      "backdrop-blur-xl",
      "border border-white/20",
      "text-white",
      // Shadow layers for depth
      "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
      // Hover - blue gradient glow
      "hover:bg-gradient-to-b hover:from-blue-500/30 hover:via-blue-600/20 hover:to-blue-700/10",
      "hover:border-blue-400/50",
      "hover:shadow-[0_0_20px_rgba(59,130,246,0.5),0_0_40px_rgba(59,130,246,0.3),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]",
      // Active
      "active:scale-[0.97]",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    ),
    secondary: cn(
      "bg-gradient-to-b from-neutral-700/50 to-neutral-800/50",
      "backdrop-blur-xl",
      "border border-neutral-600/30",
      "text-neutral-200",
      "shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
      "hover:bg-gradient-to-b hover:from-blue-500/20 hover:to-blue-600/10",
      "hover:border-blue-400/30",
      "hover:text-white",
      "hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      "active:scale-[0.97]",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    ),
    outline: cn(
      "bg-transparent",
      "backdrop-blur-xl",
      "border border-white/20",
      "text-white",
      "hover:bg-gradient-to-b hover:from-blue-500/20 hover:to-blue-600/10",
      "hover:border-blue-400/40",
      "hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      "active:scale-[0.97]",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    ),
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      id={id}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {/* Inner glow effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Blue gradient overlay on hover */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      {/* Top highlight line */}
      <span className="absolute top-[1px] left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        {children}
      </span>
      
      {/* Bottom glow */}
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-blue-500/0 group-hover:bg-blue-500/30 blur-xl rounded-full transition-all duration-500" />
    </button>
  );
}
