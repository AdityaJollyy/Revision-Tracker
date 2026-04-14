import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-dvh bg-surface-0 text-text-primary flex flex-col">
      {/* ── Desktop top nav ── */}
      <header className="sticky top-0 z-30 hidden md:flex items-center justify-between h-16 px-6 bg-surface-0/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-dim flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              DSA Tracker
            </span>
          </div>
        </div>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </header>

      {/* ── Mobile top bar ── */}
      <header className="sticky top-0 z-30 flex md:hidden items-center justify-between h-14 px-4 bg-surface-0/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent-dim flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary">
            DSA Tracker
          </span>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
            },
          }}
        />
      </header>

      {/* ── Content ── */}
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
    </div>
  );
}
