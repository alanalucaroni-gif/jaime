import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export const metadata: Metadata = { title: "Jaime Creperia — Uma obra em cada crepe", description: "Crepes artesanais doces e salgados. Escolha sua próxima obra." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><SmoothScroll>{children}</SmoothScroll></body></html>;
}
