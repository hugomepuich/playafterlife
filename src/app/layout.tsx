import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SideOrnaments from "@/components/layout/SideOrnaments";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Afterlife - Dark Fantasy Game",
  description: "Step into the dark medieval fantasy realm of Afterlife. Follow the game's development through our devblog and explore its rich universe in our codex.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white font-body">
        <NextAuthProvider>
          <SideOrnaments />
          <Navbar />
          <main className="flex-grow relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0 bg-[url('/images/stone-texture.jpg')] bg-repeat"></div>
            <div className="relative z-10">
              {children}
            </div>
          </main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
