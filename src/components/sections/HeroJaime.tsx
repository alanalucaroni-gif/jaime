"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/config/brand";
import { MagneticLink } from "@/components/ui/MagneticLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroJaime() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline().from("[data-logo]", { y: -30, opacity: 0, duration: .6 }).from("[data-word]", { yPercent: 120, rotate: -5, opacity: 0, stagger: .08, duration: .75, ease: "power4.out" }, .1).from("[data-hero-art]", { scale: .55, rotate: -16, opacity: 0, duration: 1, ease: "back.out(1.5)" }, .35).from("[data-hero-bottom]", { y: 25, opacity: 0, duration: .5 }, .75);
    gsap.to("[data-hero-art]", { yPercent: 28, rotate: 10, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 } });
  }, { scope: ref });

  return (
    <section ref={ref} className="hero">
      <div className="rays" />
      <header className="nav shell">
        <Image data-logo src="/images/jaime/logo.png" alt="Jaime Creperia" width={190} height={100} priority />
        <nav><a href="#sabores">Sabores</a><a href="#atelier">Monte o seu</a><a className="nav-order" href={brand.orderUrl}>Cardápio ↗</a></nav>
      </header>
      <div className="hero-copy shell">
        <p className="eyebrow">Crepes artesanais · doces & salgados</p>
        <h1 aria-label="Uma obra em cada crepe">
          {["UMA OBRA", "EM CADA", "CREPE"].map((word, index) => <span className={index === 1 ? "red" : ""} key={word}><i data-word>{word}</i></span>)}
        </h1>
      </div>
      <div data-hero-art className="hero-art"><Image src="/images/jaime/hero-lucie.png" alt="Crepe Lucie da Jaime" fill priority sizes="(max-width: 700px) 78vw, 620px" /></div>
      <footer data-hero-bottom className="hero-bottom shell">
        <p>Massa fininha, recheio generoso e combinações que merecem lugar de destaque.</p>
        <MagneticLink href={brand.orderUrl} className="round-cta">Pedir meu<br />crepe ↗</MagneticLink>
      </footer>
      <div className="ticker"><span>MONET · MATISSE · CEZANNE · LUCIE · MARGOT · CHAPELLE · MONET · MATISSE · CEZANNE · LUCIE · </span></div>
    </section>
  );
}
