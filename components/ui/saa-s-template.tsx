import React from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient:
        "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">Compliance Copilot</div>
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 md:flex">
            <a href="#getting-started" className="text-sm text-white/60 transition-colors hover:text-white">Getting started</a>
            <a href="#components" className="text-sm text-white/60 transition-colors hover:text-white">Components</a>
            <a href="#documentation" className="text-sm text-white/60 transition-colors hover:text-white">Documentation</a>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Button type="button" variant="ghost" size="sm">Sign in</Button>
            <Button type="button" variant="default" size="sm">Sign Up</Button>
          </div>
          <button type="button" className="text-white md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="animate-[slideDown_0.3s_ease-out] border-t border-gray-800/50 bg-black/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            <a href="#getting-started" className="py-2 text-sm text-white/60 transition-colors hover:text-white" onClick={() => setMobileMenuOpen(false)}>Getting started</a>
            <a href="#components" className="py-2 text-sm text-white/60 transition-colors hover:text-white" onClick={() => setMobileMenuOpen(false)}>Components</a>
            <a href="#documentation" className="py-2 text-sm text-white/60 transition-colors hover:text-white" onClick={() => setMobileMenuOpen(false)}>Documentation</a>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = "Navigation";

export default function SaaSTemplate(): JSX.Element {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="mb-6 max-w-3xl text-4xl font-medium md:text-5xl lg:text-6xl">Give your big idea the website it deserves</h1>
        <p className="mb-10 max-w-2xl text-sm text-gray-300 md:text-base">Landing page kit template with React, shadcn/ui and Tailwind.</p>
        <Button type="button" variant="gradient" size="lg" className="rounded-lg">Get started <ArrowRight size={16} /></Button>
      </section>
    </main>
  );
}