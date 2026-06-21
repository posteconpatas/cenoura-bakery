import type { Metadata, Viewport } from "next";
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

// 1. NUESTRO SEO "MALDITANGO"
export const metadata: Metadata = {
  title: "Cenoura Bakery | Dulzura horneada",
  description: "Dulzura horneada con el amor que te mereces. Tortas artesanales de zanahoria y chocolate.",
  icons: {
    icon: "/favicon.ico", // Asegúrate de guardar tu logo en la carpeta public/ con este nombre
  },
  openGraph: {
    title: "Cenoura Bakery",
    description: "Dulzura horneada con el amor que te mereces.",
    type: "website",
    locale: "es_BO",
  }
};

// 2. CONFIGURACIÓN MÓVIL (Pinta la barra de notificaciones del celular de rosa)
export const viewport: Viewport = {
  themeColor: "#d49a9a", 
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es" // Cambiado a español para que Google posicione bien en tu zona
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 3. Mantenemos tu estructura base, pero le inyectamos el fondo crema rústico */}
      <body className="min-h-full flex flex-col bg-[var(--bakery-cream)]">
        {children}
      </body>
    </html>
  );
}