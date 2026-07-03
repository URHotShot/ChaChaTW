import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChaChaTW - 台灣手搖飲菜單查詢",
  description: "查詢台灣連鎖手搖飲品牌菜單、比較價格、尋找附近分店。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-cream font-sans text-brew-900">
        <header className="border-b border-brew-100 bg-cream/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🧋</span>
              <span className="text-lg font-bold tracking-tight text-brew-900">
                ChaChaTW
              </span>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
