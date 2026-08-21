"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/config/brand";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroJaime() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const product = ref.current?.querySelector("[data-product]");
    ScrollTrigger.getAll().filter((trigger) => trigger.trigger === ref.current || trigger.pin === product).forEach((trigger) => trigger.kill(true));
    if (product) gsap.set(product, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => cancelAnimationFrame(refreshFrame);

    const intro = gsap.timeline({ delay: 3.35 })
      .from("[data-nav]", { y: -50, opacity: 0, duration: .7 })
      .from("[data-slam]", { yPercent: 130, rotate: (index) => index % 2 ? 5 : -5, skewY: 7, stagger: .065, duration: .78, ease: "power4.out" }, .12)
      .from("[data-product]", { y: 220, scale: .58, rotate: -12, opacity: 0, duration: 1.1, ease: "back.out(1.35)" }, .38)
      .from("[data-hero-meta]", { y: 30, opacity: 0, duration: .6 }, .85);
    const drift = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=130%", scrub: .8 } })
      .to("[data-product]", { xPercent: 30, yPercent: 115, rotate: 2, scale: .76, opacity: 1, ease: "power2.inOut", duration: .98 }, 0)
      .set("[data-product]", { visibility: "hidden" }, .99)
      .to("[data-slam='0']", { xPercent: -7, ease: "none" }, 0)
      .to("[data-slam='1']", { xPercent: 6, ease: "none" }, 0)
      .to("[data-slam='2']", { xPercent: -4, ease: "none" }, 0);

    return () => {
      cancelAnimationFrame(refreshFrame);
      intro.kill();
      drift.kill();
      ScrollTrigger.getAll().filter((trigger) => trigger.trigger === ref.current || trigger.pin === product).forEach((trigger) => trigger.kill(true));
      if (product) gsap.set(product, { clearProps: "transform,opacity,visibility" });
      ScrollTrigger.refresh();
    };
  }, { scope: ref });

  return <section ref={ref} id="top" className="story-hero">
    <header data-nav className="story-nav shell"><a href="#top" aria-label="J'aime — início"><Image src="/images/jaime/logo.png" alt="J'aime Crêpe Française" width={185} height={96} priority /></a><nav><a href="/crepes" target="_blank" rel="noreferrer">Crepes ↗</a><a href="#experiencia">Experiência</a><a href="#camadas">Ingredientes</a><a className="story-order" href={brand.orderUrl}>Pedir agora <b>↗</b></a></nav></header>
    <div className="story-hero-copy shell"><p>Crêpes généreuses · depuis toujours</p><h1>{["UMA OBRA", "EM CADA", "CREPE"].map((word, index) => <span key={word}><i data-slam={index}>{word}</i></span>)}</h1></div>
    <div data-product className="story-hero-product"><Image src="/images/jaime/hero-full-cone-transparent-v4.png" alt="Crepe doce artesanal J'aime" fill priority sizes="(max-width: 800px) 100vw, 58vw" /></div>
    <div data-hero-meta className="story-hero-side"><div className="story-seal">FAIT AVEC<br/><strong>AMOUR</strong></div><a href="#experiencia">ROLE PARA EXPLORAR <b>↓</b></a></div>
  </section>;
}
