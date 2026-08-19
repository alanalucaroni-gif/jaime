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

    gsap.timeline({ scrollTrigger: { trigger: "[data-savory]", start: "top top", end: "+=1450", pin: true, scrub: .75, anticipatePin: 1 } })
      .fromTo("[data-savory-product]", { yPercent: 24, scale: .64, rotate: -7, opacity: 0 }, { yPercent: -30, xPercent: 5, scale: 1, rotate: 15, transformOrigin: "50% 90%", opacity: 1, duration: .62, ease: "power3.out" }, 0)
      .to("[data-savory-copy]", { opacity: .22, y: -35, duration: .45 }, .28)
      .fromTo("[data-doritos-rain]", { opacity: 0, y: 0, x: 0, scale: .25 }, { opacity: 1, y: () => innerHeight * .66, x: (i) => innerWidth * [.18,.24,.3,.36,.42,.48,.54][i], scale: (i) => [.7,1.05,.82,1.2,.74,1.08,.88][i], rotate: (i) => [-340,280,-210,390,-280,330,-240][i], duration: .92, stagger: .045, ease: "power2.in" }, .38)
      .fromTo("[data-bacon-rain]", { opacity: 0, y: 0, x: 0, scale: .2 }, { opacity: 1, y: () => innerHeight * .62, x: (i) => innerWidth * [.21,.28,.35,.42,.49,.56][i], scale: (i) => [.72,1,.8,1.08,.76,.94][i], rotate: (i) => [260,-320,380,-260,300,-350][i], duration: .86, stagger: .055, ease: "power2.in" }, .44);

    gsap.timeline({ scrollTrigger: { trigger: "[data-layers]", start: "top top", end: "+=2100", pin: true, scrub: 1 } })
      .to("[data-ring='1']", { y: -190, rotate: -15, scale: 1.05 }, 0)
      .to("[data-ring='2']", { y: -70, x: 130, rotate: 12 }, 0)
      .to("[data-ring='3']", { y: 85, x: -120, rotate: -10 }, 0)
      .to("[data-ring='4']", { y: 210, rotate: 13, scale: .95 }, 0)
      .from("[data-layer-copy]", { opacity: 0, x: (i) => i % 2 ? 50 : -50, stagger: .12 }, .25)
      .to("[data-layer-title]", { scale: .82, opacity: .16 }, 0);
  }, { scope: ref });

  return <div ref={ref}>
    <section id="experiencia" className="manifesto"><div className="shell"><p data-reveal className="section-label">TOP CLASSIC · JAIME CREPERIA</p><h2 data-reveal>FININHO POR FORA.<span>ABSURDO POR DENTRO.</span></h2><div className="manifesto-grid"><p data-reveal>Na Jaime, cada crepe nasce na hora. Massa leve, recheio sem economia e combinações que transformam fome em desejo.</p><a data-reveal href={brand.orderUrl}>PEDIR AGORA ↗</a></div></div><div className="type-ribbon"><span>DOCE · SALGADO · CROCANTE · CREMOSO · DOCE · SALGADO · CROCANTE · CREMOSO · </span></div></section>

    <section data-savory className="feature-split savory-feature">
      <div className="feature-photo savory-stage">
        <div data-savory-product className="savory-product"><Image src="/images/jaime/savory-crepe-transparent-v1.png" alt="Crepe salgado da Jaime com Doritos e bacon" fill priority sizes="(max-width: 900px) 92vw, 50vw" /></div>
        <div className="savory-rain" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, index) => <span data-doritos-rain key={`doritos-${index}`} className={`doritos-rain doritos-${index}`}><Image src="/images/jaime/doritos-sprite-v1.png" alt="" fill sizes="130px" /></span>)}
          {Array.from({ length: 6 }).map((_, index) => <span data-bacon-rain key={`bacon-${index}`} className={`bacon-rain bacon-${index}`}><Image src="/images/jaime/bacon-sprite-v1.png" alt="" fill sizes="150px" /></span>)}
        </div>
      </div>
      <div data-savory-copy className="feature-copy"><p className="section-label">EXPERIENCE</p><h2>COMIDA QUE<br/><span>MUDA O HUMOR.</span></h2><div className="feature-stats"><div><b>01</b><p>Massa preparada para ficar leve e crocante.</p></div><div><b>02</b><p>Recheios generosos do começo ao fim.</p></div><div><b>03</b><p>Combinações clássicas ou totalmente suas.</p></div></div></div>
    </section>

    <section id="camadas" data-layers className="layers"><div className="layers-head"><p>PURE QUALITY</p><h2 data-layer-title>CADA CAMADA<br/><span>CONTA UMA HISTÓRIA</span></h2></div><div className="crepe-stack"><div data-ring="1" className="stack-ring ring-candy">CONFETE</div><div data-ring="2" className="stack-ring ring-chocolate">CHOCOLATE</div><div data-ring="3" className="stack-ring ring-fruit">MORANGO</div><div data-ring="4" className="stack-ring ring-dough">MASSA</div></div><div className="layer-notes"><p data-layer-copy>01 — cores que chegam primeiro</p><p data-layer-copy>02 — cremosidade que segura tudo</p><p data-layer-copy>03 — frescor no meio da intensidade</p><p data-layer-copy>04 — a base fina que vira assinatura</p></div></section>
    <section className="story"><div className="shell"><p data-reveal className="section-label">A STORY IN EVERY BITE</p><h2 data-reveal>DO PRIMEIRO<br/>OLHAR AO<br/><span>ÚLTIMO PEDAÇO.</span></h2><div className="story-cards"><article data-reveal><span>PARIS?</span><h3>QUASE.</h3><p>O charme é francês. A generosidade é toda Jaime.</p></article><article data-reveal><span>SEU JEITO</span><h3>MONTE.</h3><p>Escolha massa, recheios e finalizações.</p></article><article data-reveal><span>SEM ESPERA</span><h3>PEÇA.</h3><p>Seu próximo crepe está a poucos cliques.</p></article></div></div></section>
  </div>;
}

export function JaimeFinal() {
  return <section className="final-v2"><div className="final-bg"><Image src="/images/jaime/hero-campaign-v2.png" alt="" fill sizes="100vw" /></div><div className="final-overlay"/><div className="final-type"><span>FEEL THE CRÊPE · FEEL THE CRÊPE ·</span><i>JAIME · JAIME · JAIME ·</i></div><div className="final-content"><p>FAIT AVEC AMOUR</p><h2>JÁ ESCOLHEU<br/><span>SUA OBRA?</span></h2><a href={brand.orderUrl}>PEDIR MEU<br/>CREPE ↗</a></div></section>;
}
