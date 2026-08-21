"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/config/brand";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const items = [
  { name: "Monet", type: "Salgado", price: "R$ 44,99", text: "Muçarela, carne moída, bacon, cebola roxa e requeijão.", image: "/images/jaime/monet.png", color: "green-card" },
  { name: "Matisse", type: "Salgado", price: "R$ 44,99", text: "Muçarela, frango, bacon, requeijão e tomate-cereja.", image: "/images/jaime/matisse.png", color: "red-card" },
  { name: "Chapelle", type: "Vegetariano", price: "R$ 42,99", text: "Muçarela, brócolis, tomate-cereja, batata palha e requeijão.", image: "/images/jaime/chapelle.png", color: "blue-card" },
  { name: "Lucie", type: "Doce", price: "R$ 40,99", text: "Massa de baunilha, chocolate com avelã, confete e KitKat.", image: "/images/jaime/lucie.png", color: "red-card" },
  { name: "Margot", type: "Doce", price: "R$ 47,99", text: "Massa de chocolate, creme de avelã, Ovomaltine, Oreo e morango.", image: "/images/jaime/margot.png", color: "cream-card" },
  { name: "Cezanne", type: "Salgado", price: "R$ 42,99", text: "Muçarela, bacon, champignon, requeijão e Doritos.", image: "/images/jaime/cezanne.png", color: "blue-card" },
];

export function JaimeMenu() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.from(".menu-card", { y: 100, opacity: 0, rotate: -2, stagger: .08, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 65%" } });
  }, { scope: ref });
  return (
    <section ref={ref} id="sabores" className="story-menu">
      <header className="shell story-menu-head"><div><p>LA GALERIE DE J&apos;AIME</p><h2>ESCOLHA SUA OBRA</h2></div><a href={brand.orderUrl}>VER CARDÁPIO COMPLETO ↗</a></header>
      <div className="story-menu-rail">{items.map((item, index) => <article className="menu-card" key={item.name}>
        <div className={`story-menu-photo ${item.color}`}><Image src={item.image} alt={`Crepe ${item.name}`} fill sizes="(max-width: 800px) 78vw, 28vw" /></div>
        <div className="story-menu-meta"><span>{String(index + 1).padStart(2, "0")} · {item.type}</span><h3>{item.name}</h3><p>{item.text}</p><div><strong>{item.price}</strong><a href={brand.orderUrl} aria-label={`Pedir ${item.name}`}>↗</a></div></div>
      </article>)}</div>
    </section>
  );
}
