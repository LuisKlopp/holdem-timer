import "../styles/globals.css";

import type { Metadata } from "next";

import ReactQueryProvider from "@/providers/react-query-provider";
import { dmDisplay, pretendard } from "@/public/fonts/fonts";

export const metadata: Metadata = {
  title: "Hold'em Tournament Timer",
  description: "브라우저에서 안정적으로 동작하는 홀덤 토너먼트 블라인드 타이머",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} ${dmDisplay.variable}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
