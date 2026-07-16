import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideNavBar from "@/components/layout/SideNavBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cénit - Dashboard",
  description: "Sistema de gestión hotelera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-on-background antialiased flex bg-background min-h-screen">
        <SideNavBar />
        <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
