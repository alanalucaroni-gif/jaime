import Image from "next/image";
import { brand } from "@/config/brand";

export function JaimeFooter() {
  return <footer className="story-footer"><div className="shell story-footer-top"><Image src="/images/jaime/logo.png" alt="J'aime Creperia" width={180} height={96}/><nav><a href="#top">Início</a><a href="#experiencia">Experiência</a><a href="/crepes" target="_blank" rel="noreferrer">Crepes ↗</a><a href={brand.orderUrl}>Pedir agora ↗</a></nav></div><div className="story-footer-word">J&apos;AIME</div><div className="shell story-footer-bottom"><span>© {new Date().getFullYear()} J&apos;aime Creperia</span><span>Uma obra em cada crepe.</span></div></footer>;
}
