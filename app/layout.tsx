import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
