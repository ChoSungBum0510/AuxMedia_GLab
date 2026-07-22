import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  let metadataBase: URL;
  try {
    metadataBase = new URL(`${protocol}://${host}`);
  } catch {
    metadataBase = new URL("https://glab-regional-learning.example");
  }

  const description = "정선·동해·인제 G-Lab과 강릉 M Campus의 지역 교육·협력, 과정·신청·성과를 통합 관리하는 한림대학교 지역교육 플랫폼입니다.";
  const imageUrl = new URL("/og.png", metadataBase).toString();
  return {
    metadataBase,
    title: { default: "GLab | 지역교육 통합지원 플랫폼", template: "%s | GLab" },
    description,
    keywords: ["G-Lab", "GLab", "M Campus", "지역혁신", "지역교육", "정선", "동해", "인제", "강릉", "한림대학교", "교육신청"],
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "GLab 지역교육 통합지원",
      title: "G-Lab | 지역이 변하는 순간",
      description,
      images: [{ url: imageUrl, width: 1734, height: 907, alt: "GLab 지역교육 통합지원" }],
    },
    twitter: { card: "summary_large_image", title: "G-Lab | 지역이 변하는 순간", description, images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a href="#main-content" className="skip-link">본문 바로가기</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
