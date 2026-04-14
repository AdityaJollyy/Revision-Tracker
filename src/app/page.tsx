import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-dvh bg-surface-0 flex flex-col">
      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-dim border border-accent-muted/40 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-accent tracking-wide">
              Science-backed spaced repetition
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary mb-5 leading-[1.1]">
            Never forget
            <br />
            <span className="bg-linear-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              what you solved
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-md mx-auto mb-10 leading-relaxed">
            Track your DSA problems, schedule spaced revisions automatically,
            and build lasting mastery — one problem at a time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-8 py-3.5 bg-accent text-text-inverse font-semibold text-sm rounded-lg hover:bg-accent-hover transition-colors duration-200 focus-ring"
            >
              Get started free
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto px-8 py-3.5 bg-surface-2 text-text-secondary font-semibold text-sm rounded-lg border border-border-default hover:border-border-strong hover:text-text-primary transition-all duration-200 focus-ring"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        className="px-6 pb-24 animate-slide-up"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <FeatureCard
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
            title="Smart scheduling"
            description="Revisions at day 1, 3, 7, 15, 30, 60, 120 — optimized for long-term retention."
          />
          <FeatureCard
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
            }
            title="Progress tracking"
            description="Visual progress for every problem. See what's done, what's due, and what's overdue."
          />
          <FeatureCard
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
            }
            title="Topics & Concepts"
            description="Tag problems by topic. Track both coding problems and conceptual knowledge."
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border-subtle py-6 text-center">
        <p className="text-xs text-text-muted">
          Built for focused DSA preparation.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-5 sm:p-6 rounded-xl bg-surface-1 border border-border-subtle hover:border-border-default transition-colors duration-300">
      <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}
