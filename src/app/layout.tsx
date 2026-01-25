import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "Prog Web - Espace d'apprentissage",
  description: "Application web d'apprentissage avec navigation hiérarchique",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prog Web",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
