"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/config/brand";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function JaimeExperience() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
      gsap.from(el, { y: 90, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%" } })
    );

    gsap.timeline({ scrollTrigger: { trigger: "[data-personalities]", start: "top top", end: "+=1250", pin: true, scrub: .85, anticipatePin: 1 } })
      .set("[data-sweet-product], [data-sweet-ingredient]", { opacity: 0 }, 0)
      .to("[data-sweet-product], [data-sweet-ingredient]", { opacity: 1, duration: .025 }, .02)
      .to("[data-sweet-product]", { xPercent: -18, yPercent: -10, rotate: -12, scale: .72, opacity: 0, duration: .3, ease: "power2.in" }, .12)
      .to("[data-sweet-ingredient]", { x: (index) => [-150, 125, -90][index], y: (index) => [-160, -120, 150][index], rotate: (index) => [-90, 110, -70][index], scale: .35, opacity: 0, stagger: .035, duration: .28 }, .14)
      .to("[data-personality-sweet]", { y: -25, opacity: 0, duration: .2 }, .2)
      .to("[data-personality-bg]", { backgroundColor: "#f23f46", duration: .3 }, .27)
      .fromTo("[data-savory-product-card]", { xPercent: 24, yPercent: 18, rotate: 12, scale: .62, opacity: 0 }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: .42, ease: "back.out(1.35)" }, .34)
      .fromTo("[data-savory-ingredient]", { y: -130, rotate: -80, scale: .25, opacity: 0 }, { y: 0, rotate: 0, scale: 1, opacity: 1, stagger: .055, duration: .35, ease: "back.out(1.7)" }, .42)
      .fromTo("[data-personality-savory]", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: .24 }, .5)
      .to("[data-savory-product-card]", { yPercent: 80, rotate: 5, scale: .72, opacity: 0, duration: .22, ease: "power2.in" }, .88)
      .to("[data-savory-ingredient], [data-personality-savory]", { y: 70, opacity: 0, duration: .16 }, .9);

    gsap.timeline({ scrollTrigger: { trigger: "[data-savory]", start: "top top", end: "+=1100", pin: true, scrub: .8, anticipatePin: 1 } })
      .fromTo("[data-savory-product]", { yPercent: -80, scale: .72, rotate: 5, opacity: 0 }, { yPercent: -3, scale: 1, rotate: 0, opacity: 1, duration: .55, ease: "power3.out" })
      .from("[data-feature-note]", { opacity: 0, x: (index) => index % 2 ? 50 : -50, stagger: .08, duration: .35 }, .25)
      .to("[data-savory-product]", { scale: 1.08, yPercent: -8, duration: .45 }, .55);

    gsap.timeline({ scrollTrigger: { trigger: "[data-layers]", start: "top top", end: "+=2100", pin: true, scrub: 1 } })
      .to("[data-ring='1']", { y: -180, rotate: -4, scale: 1.04 }, 0)
      .to("[data-ring='2']", { y: -60, rotate: 3 }, 0)
      .to("[data-ring='3']", { y: 85, rotate: -3 }, 0)
      .from("[data-layer-copy]", { opacity: 0, x: (index) => index % 2 ? 50 : -50, stagger: .12 }, .25)
      .to("[data-layer-title]", { scale: .82, opacity: .16 }, 0);
  }, { scope: ref });

  return <div ref={ref}>
    <section id="experiencia" data-personalities className="story-manifesto story-personalities"><div className="shell story-manifesto-grid"><div className="story-manifesto-copy"><i/><p>DUAS PERSONALIDADES · UMA J&apos;AIME</p><h2>DOCE NO DESEJO.<br/><span>SALGADO NA ATITUDE.</span></h2><p>Do morango com chocolate ao bacon com Doritos: escolha seu humor e deixe a J&apos;aime transformar em crepe.</p><a href={brand.orderUrl}>QUAL É A SUA HOJE? ↗</a></div><div data-personality-bg className="personality-stage"><div data-personality-sweet className="personality-label label-sweet"><small>01 · DOUCE</small><strong>DOCE</strong></div><div data-personality-savory className="personality-label label-savory"><small>02 · SALÉE</small><strong>SALGADO</strong></div><div data-sweet-product className="personality-product sweet-personality"><Image src="/images/jaime/hero-full-cone-transparent-v4.png" alt="Crepe doce J'aime" fill sizes="(max-width:900px) 90vw, 45vw" /></div><div data-savory-product-card className="personality-product savory-personality"><Image src="/images/jaime/savory-crepe-transparent-v1.png" alt="Crepe salgado J'aime" fill sizes="(max-width:900px) 90vw, 45vw" /></div><div className="personality-ingredients" aria-hidden="true"><span data-sweet-ingredient className="personality-sprite sweet-sprite-a"><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" fill sizes="100px"/></span><span data-sweet-ingredient className="personality-sprite sweet-sprite-b"><Image src="/images/jaime/cookie-transparent-v1.png" alt="" fill sizes="110px"/></span><span data-sweet-ingredient className="personality-dot sweet-dot"/><span data-savory-ingredient className="personality-sprite savory-sprite-a"><Image src="/images/jaime/doritos-sprite-v1.png" alt="" fill sizes="110px"/></span><span data-savory-ingredient className="personality-sprite savory-sprite-b"><Image src="/images/jaime/bacon-sprite-v1.png" alt="" fill sizes="120px"/></span><span data-savory-ingredient className="personality-dot savory-dot"/></div></div></div></section>

    <section data-savory className="story-feature"><p className="story-feature-kicker">EXPERIÊNCIA</p><h2>COMIDA QUE<br/>MUDA O HUMOR.</h2><div data-savory-product className="story-feature-product"><Image src="/images/jaime/savory-crepe-transparent-v1.png" alt="Crepe salgado com Doritos e bacon" fill sizes="(max-width:900px) 92vw, 55vw" /></div><div className="story-feature-notes"><p data-feature-note>INGREDIENTES<br/><strong>SELECIONADOS</strong></p><p data-feature-note>COMBINAÇÕES<br/><strong>AUTORAIS</strong></p><p data-feature-note>MASSA FINA<br/><strong>E LEVE</strong></p><p data-feature-note>FEITO NA HORA.<br/><strong>SEMPRE.</strong></p></div></section>

    <section id="camadas" data-layers className="story-layers"><div className="story-layers-copy"><p>PURE QUALITY</p><h2 data-layer-title>CADA CAMADA<br/>CONTA UMA<br/><span>HISTÓRIA</span></h2></div><div className="story-stack"><div data-ring="1" className="real-layer layer-chocolate">CHOCOLATE</div><div data-ring="2" className="real-layer layer-strawberry"><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" width={100} height={100}/><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" width={90} height={90}/><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" width={105} height={105}/></div><div data-ring="3" className="real-layer layer-cream">CREME</div></div><div className="story-layer-notes"><p data-layer-copy>COBERTURAS IRRESISTÍVEIS</p><p data-layer-copy>FRUTAS FRESCAS</p><p data-layer-copy>CREMES INCRÍVEIS</p></div></section>
  </div>;
}

export function JaimeFinal() {
  return <section className="story-final"><div className="story-final-copy"><p>FAIT AVEC AMOUR</p><h2>VÁ DE J&apos;AIME.<br/>VÁ DE CREPE.</h2><a href={brand.orderUrl}>PEDIR AGORA <b>↗</b></a></div><div className="story-final-photo"><Image src="/images/jaime/hero-campaign-v2.png" alt="Crepe doce J'aime" fill sizes="(max-width:800px) 100vw, 50vw" /></div></section>;
}
