import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@trm/_components/theme-provider";
import { Metadata } from "next";
import { NetworkStatus } from "@trm/_components/_layout/network-status/network-status";
import { AuthProvider } from "./_lib/auth/auth-context";
import { Toaster } from "sonner";

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
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
        <NetworkStatus />
      </body>
    </html>
  );
}

