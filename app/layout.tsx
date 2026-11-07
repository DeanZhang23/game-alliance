import type { Metadata } from "next";
import { Noto_Sans_SC, Press_Start_2P } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const sans = Noto_Sans_SC({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-app-sans",
  display: "swap",
});

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Game · 公用游戏联盟",
  description: "人人共创永不关机的世界。一句话想法生成轻量点击或放置游戏，按游玩、点赞、分享挖矿。创作者为主，玩家小头。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} ${pixel.variable}`}>
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
