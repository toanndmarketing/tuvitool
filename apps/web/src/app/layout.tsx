import type { Metadata } from "next";
import { K2D } from "next/font/google";
import "./globals.css";

const k2d = K2D({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-k2d",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tử Vi Lá Số | Luận Giải Bản Mệnh Chuyên Sâu AI",
  description: "Tra cứu Tử Vi Đẩu Số, luận giải lá số bản mệnh chuyên sâu bằng AI. Phân tích 12 cung, 108 sao, Đại Vận, Tiểu Vận — phương pháp Tân Tam Hợp V11.",
  keywords: "Tử Vi Đẩu Số, lá số tử vi, luận giải tử vi, bản mệnh, AI tử vi",
  openGraph: {
    title: "Tử Vi Lá Số AI — Luận Giải Chuyên Sâu",
    description: "Xem Tử Vi Đẩu Số chuyên sâu bằng AI — phân tích 12 cung, 108 sao, Đại Vận năm 2025/2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={k2d.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ fontFamily: "'K2D', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
