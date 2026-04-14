import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSA Tracker — Spaced Repetition for DSA",
  description:
    "Master DSA with science-backed spaced repetition. Track, schedule, and never forget the problems you've solved.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        theme: dark,
      }}
    >
      <html lang="en" className={inter.variable}>
        <head>
          <meta name="theme-color" content="#09090b" />
        </head>
        <body className="bg-surface-0 text-text-primary antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
