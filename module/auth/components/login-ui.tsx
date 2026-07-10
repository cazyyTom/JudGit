"use client";

import React, { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Logomark: a git-graph node/branch merged with a review checkmark
const JudgitMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <rect x="1" y="1" width="30" height="30" rx="9" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="11" cy="9.5" r="2.25" fill="currentColor" />
    <circle cx="11" cy="22.5" r="2.25" fill="currentColor" />
    <path d="M11 11.75V20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 15C11 17.9 13.4 17.9 16.5 17.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 14.5L22.2 16.7L26.3 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-xl bg-card min-h-155">
        <div
          className="relative hidden md:flex flex-col p-12 lg:p-14 text-primary-foreground overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.4732 0.1247 46.2007) 0%, oklch(0.3105 0.0862 40.5) 100%)",
          }}
        >
          {/* subtle diff-hunk texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 14px)",
            }}
          />

          {/* Wordmark */}
          <div className="relative flex items-center gap-2.5">
            <JudgitMark className="w-8 h-8" />
            <span className="font-serif text-xl font-semibold tracking-tight">JudGit</span>
          </div>

          {/* Headline */}
          <div className="relative mt-16 max-w-md">
            <span className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">
              AI code review
            </span>
            <h2 className="font-serif text-[2.15rem] leading-[1.15] mt-4 mb-4">
              Every pull request, reviewed before your team opens it.
            </h2>
            <p className="text-primary-foreground/75 text-[15px] leading-relaxed">
              JudGit reads the diff, flags the risk, and leaves the comment —
              so review time turns into ship time.
            </p>
          </div>

          {/* Signature: mock diff + AI review callout */}
          <div className="relative mt-12">
            <div className="rounded-lg bg-black/25 backdrop-blur-sm border border-primary-foreground/15 font-mono text-[12.5px] leading-relaxed p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-primary-foreground/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-2 text-primary-foreground/50 text-[11px]">auth/session.ts</span>
              </div>
              <div className="text-primary-foreground/45">&nbsp;&nbsp;40&nbsp;&nbsp;{" "}</div>
              <div className="bg-red-500/15 text-red-200/90 px-1 -mx-1 rounded-[2px]">
                -&nbsp;41&nbsp;&nbsp;const token = req.headers.get(&quot;x-token&quot;)
              </div>
              <div className="bg-green-500/15 text-green-200/90 px-1 -mx-1 rounded-[2px]">
                +&nbsp;41&nbsp;&nbsp;const token = req.headers.get(&quot;x-token&quot;) ?? null
              </div>
              <div className="text-primary-foreground/45">&nbsp;&nbsp;42&nbsp;&nbsp;if (!token) throw new Error(...)</div>
            </div>

            <div className="absolute -right-3 -bottom-7 max-w-47.5 rounded-lg bg-accent text-accent-foreground text-xs px-3 py-2.5 shadow-lg rotate-2">
              <span className="block font-mono text-[9.5px] uppercase tracking-wide opacity-70 mb-1">
                JudGit review
              </span>
              Null check added — this used to throw on a missing token.
            </div>
          </div>

          {/* Terminal-style footer stat */}
          <div className="relative mt-auto pt-8 border-t border-primary-foreground/10 font-mono text-xs text-primary-foreground/60 flex flex-wrap items-center gap-x-2">
            <span className="text-primary-foreground/40">$</span>
            <span>judgit review --pr 482</span>
            <span className="text-primary-foreground/40">· 1,842 issues caught this week</span>
          </div>
        </div>

        {/* Right panel — sign in */}
        <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20 bg-card">
          <div className="flex items-center gap-2.5 mb-10 md:hidden text-primary">
            <JudgitMark className="w-7 h-7" />
            <span className="font-serif text-lg font-semibold text-accent-foreground">JudGit</span>
          </div>

          <div className="max-w-sm mx-auto w-full">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Sign in
            </span>
            <h1 className="font-serif text-3xl md:text-[2.25rem] leading-tight text-primary mt-3 mb-3">
              Welcome back to JudGit
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
              Connect your GitHub account to let JudGit start reviewing pull
              requests across your repos.
            </p>

            <Button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full h-12 text-[15px] font-medium gap-2.5"
            >
              <GithubIcon className="w-4.5 h-4.5" />
              {isLoading ? "Connecting..." : "Continue with GitHub"}
            </Button>

            <p className="font-mono text-[11px] text-muted-foreground/70 text-center mt-4">
              read-only access · revoke anytime in GitHub settings
            </p>

            <p className="text-xs text-muted-foreground mt-10 leading-relaxed">
              By continuing, you agree to JudGit&apos;s{" "}
              <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}