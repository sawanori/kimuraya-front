import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "木村屋本店 サンプル店",
  description: "本場九州仕込みの博多もつ鍋専門店",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500&family=Shippori+Mincho:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/slideshow-fix.css" />
        <link rel="stylesheet" href="/css/menu-fix.css" />
        <link rel="stylesheet" href="/css/gallery-mobile-fix.css" />
        <link rel="stylesheet" href="/css/seats-slideshow-fix.css" />
        <link rel="stylesheet" href="/css/modal-fix.css" />
        <link rel="stylesheet" href="/css/mobile-menu-transparent.css" />
        <link rel="stylesheet" href="/css/bottom-nav-fix.css" />
        <link rel="stylesheet" href="/css/motsunabe-section.css" />
        <link rel="stylesheet" href="/css/seat-tags-fix.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
