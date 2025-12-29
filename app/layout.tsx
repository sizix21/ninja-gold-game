'use client';
import "./globals.css";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        <TonConnectUIProvider manifestUrl="https://white-important-mule-491.netlify.app/tonconnect-manifest.json">
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  );
}