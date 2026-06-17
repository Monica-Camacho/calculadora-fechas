import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Calculadora de Fechas | Diferencia entre dos fechas en años, meses y días",
  description: "Calcula la diferencia exacta entre dos fechas. Obtén años, meses, semanas y días entre cualquier intervalo de tiempo de forma rápida y gratuita.",
  metadataBase: new URL("https://calculadora-fechas.vercel.app"),
  alternatives: {
    canonical: "/",
  },
  openGraph: {
    title: "Calculadora de Fechas | Diferencia entre dos fechas en años, meses y días",
    description: "Calcula la diferencia exacta entre dos fechas. Obtén años, meses, semanas y días entre cualquier intervalo de tiempo de forma rápida y gratuita.",
    url: "https://calculadora-fechas.vercel.app",
    siteName: "Calculadora de Fechas Mónica Camacho",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Fechas | Diferencia entre dos fechas en años, meses y días",
    description: "Calcula la diferencia exacta entre dos fechas. Obtén años, meses, semanas y días entre cualquier intervalo de tiempo de forma rápida y gratuita.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">{children}</body>
    </html>
  );
}
