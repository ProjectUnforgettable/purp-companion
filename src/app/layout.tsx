import type { Metadata, Viewport } from "next";
import { Manrope, Outfit, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { MockStoreProvider } from "@/lib/mock-store";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PURP | Project Unforgettable",
    template: "%s · PURP",
  },
  description:
    "Mobile companion for PURP | Project Unforgettable — status, rules, departments, and more.",
  applicationName: "PURP",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PURP",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${manrope.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-dvh font-sans">
        <MockStoreProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </MockStoreProvider>
      </body>
    </html>
  );
}
