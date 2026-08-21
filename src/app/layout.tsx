import type { Metadata } from "next";
import { Modak, Mouse_Memoirs } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

const modak = Modak({ weight: "400", subsets: ["latin"], variable: "--font-modak" });
const mouseMemoirs = Mouse_Memoirs({ weight: "400", subsets: ["latin"], variable: "--font-mouse" });

export const metadata: Metadata = { title: "Jaime Creperia — Uma obra em cada crepe", description: "Crepes artesanais doces e salgados. Escolha sua próxima obra." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${modak.variable} ${mouseMemoirs.variable}`}><body><SmoothScroll>{children}</SmoothScroll></body></html>;
}
