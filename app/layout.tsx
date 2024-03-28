import { Inter } from "next/font/google";
import "./globals.css";
import { SideBar } from "@trm/_layout/sidebar/sidebar";
import Header from "@trm/_layout/header/header";
import PageWrapper from "@trm/_components/pagewrapper";
import { ThemeProvider } from "@trm/_components/theme-provider";
import { Metadata } from "next";
import { NetworkStatus } from "@trm/_layout/network-status/network-status";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " h-screen overflow-hidden"}>
        <ThemeProvider
          themes={["dark", "custom", "light"]}
          attribute="class"
          enableSystem
          disableTransitionOnChange>
          <>
            <Header />
            <div className="flex h-full w-full justify-center">
              <SideBar />
              <PageWrapper children={children} />
            </div>
          </>
        </ThemeProvider>
        <NetworkStatus />
      </body>
    </html>
  );
}
