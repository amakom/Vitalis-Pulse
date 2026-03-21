import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToastProvider } from "@/components/layout/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VitalisPulse — The Heartbeat of Web3",
  description: "Real-time health scores for Web3 projects. Track treasury health, development activity, community retention, and more. The credit score for crypto.",
  keywords: ["web3", "crypto", "project health", "vitalispulse", "vitalis", "defi", "blockchain analytics"],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "VitalisPulse — The Heartbeat of Web3",
    description: "Real-time health scores for Web3 projects. Is your favorite project thriving or dying?",
    url: "https://www.vitalispulse.xyz",
    siteName: "VitalisPulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitalisPulse — The Heartbeat of Web3",
    description: "Real-time health scores for Web3 projects. Is your favorite project thriving or dying?",
    site: "@vitalispulse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Analytics />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
