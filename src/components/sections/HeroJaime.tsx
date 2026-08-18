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
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline({ delay: 2.15 }).from("[data-nav]", { y: -50, opacity: 0, duration: .7 }).from("[data-slam]", { yPercent: 130, rotate: i => i % 2 ? 5 : -5, skewY: 7, stagger: .065, duration: .78, ease: "power4.out" }, .12).from("[data-product]", { y: 220, scale: .58, rotate: -12, opacity: 0, duration: 1.1, ease: "back.out(1.35)" }, .38).from("[data-hero-meta]", { y: 30, opacity: 0, duration: .6 }, .85);
    const scroll = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=1800", pin: true, scrub: 1, anticipatePin: 1 } });
    scroll.to("[data-product]", { yPercent: -4, scale: .92, rotate: 180, transformOrigin: "50% 55%", duration: 1.05, ease: "power2.inOut" }, 0)
      .to("[data-slam='0']", { xPercent: -18 }, 0)
      .to("[data-slam='1']", { xPercent: 15 }, 0)
      .to("[data-slam='2']", { xPercent: -10 }, 0)
      .to("[data-hero-fade]", { opacity: .18, y: -55 }, .35)
      .fromTo("[data-falling-fruit]", { opacity: 0, scale: .3, y: 0, x: 0 }, { opacity: 1, scale: i => [.86,.62,1,.7,.8][i], y: () => innerHeight * 1.18, x: i => [-300,-135,10,155,310][i], rotate: i => [-320,260,-210,360,290][i], duration: 1.45, stagger: .07, ease: "power1.in" }, .55);
  }, { scope: ref });
  return <section ref={ref} className="hero-v2">
    <header data-nav className="nav-v2 shell"><Image src="/images/jaime/logo.png" alt="Jaime Creperia" width={175} height={90} priority /><nav><a href="#experiencia">A experiência</a><a href="#sabores">Sabores</a><a href="#camadas">Ingredientes</a><a className="menu-pill" href={brand.orderUrl}>Pedir agora ↗</a></nav></header>
    <div data-hero-fade className="hero-title shell"><p>Crêpes généreuses · depuis toujours</p><h1>{["UMA OBRA", "EM CADA", "CREPE"].map((w,i)=><span key={w}><i data-slam={i}>{w}</i></span>)}</h1></div>
    <div data-product className="campaign-product"><Image src="/images/jaime/hero-full-cone-transparent-v4.png" alt="Crepe doce artesanal da Jaime com morangos e chocolate" fill priority sizes="(max-width: 768px) 90vw, 650px" /></div>
    <div className="falling-fruits" aria-hidden="true">{Array.from({ length: 5 }).map((_, index) => <span data-falling-fruit key={index} className={`falling-fruit fruit-${index}`}><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" fill sizes="110px" /></span>)}</div>
    <footer data-hero-meta className="hero-meta shell"><p>Da massa ao último toque,<br/>cada detalhe importa.</p><div className="hero-stamp">C'EST<br/><strong>MAGNIFIQUE</strong></div><a href={brand.orderUrl}>EXPLORAR CARDÁPIO <b>↘</b></a></footer>
    <div className="hero-marquee"><span>CREPES DOCES · CREPES SALGADOS · MONTE O SEU · CREPES DOCES · CREPES SALGADOS · MONTE O SEU · </span></div>
  </section>;
}
