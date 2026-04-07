import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "UnionManager Africa",
  description: "Plateforme de gestion syndicale pour l'Afrique",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F8F7F4]">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 transition-all duration-300">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
