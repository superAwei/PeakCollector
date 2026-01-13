import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ClientLayout from "@/components/ClientLayout";
import OpenInBrowserPrompt from "@/components/OpenInBrowserPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeakCollector - 台灣百岳數位護照",
  description: "記錄你的每一步登頂時刻，點亮屬於你的百岳地圖",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* 嵌入式瀏覽器提示（最高層級，z-index: 300） */}
        <OpenInBrowserPrompt />

        {gaId && <GoogleAnalytics gaId={gaId} />}
        <ClientLayout>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
