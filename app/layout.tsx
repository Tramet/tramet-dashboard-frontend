import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@trm/_components/theme-provider";
import { Metadata } from "next";
import { NetworkStatus } from "@trm/_layout/network-status/network-status";
import { AuthProvider } from "./_lib/auth/auth-context";

const inter = Inter({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tramet",
  description: "Dashboard for tramet services",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " h-screen overflow-hidden"}>
        <ThemeProvider themes={["dark", "custom", "light"]} attribute="class" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <NetworkStatus />
      </body>
    </html>
  );
}
