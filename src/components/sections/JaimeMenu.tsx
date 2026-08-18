"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/config/brand";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const items = [
  { name: "Monet", type: "Salgado", price: "R$ 44,99", text: "Muçarela, carne moída, bacon, cebola roxa e requeijão.", image: "/images/jaime/monet.png", color: "red-card" },
  { name: "Matisse", type: "Salgado", price: "R$ 44,99", text: "Muçarela, frango, bacon, requeijão e tomate-cereja.", image: "/images/jaime/matisse.png", color: "blue-card" },
  { name: "Chapelle", type: "Vegetariano", price: "R$ 42,99", text: "Muçarela, brócolis, tomate-cereja, batata palha e requeijão.", image: "/images/jaime/chapelle.png", color: "green-card" },
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
    <section ref={ref} id="sabores" className="menu-section">
      <div className="shell"><p className="eyebrow">La galerie de Jaime</p><h2>ESCOLHA <span>SUA OBRA</span></h2>
        <div className="menu-grid">{items.map((item, index) => <article className={`menu-card ${item.color}`} key={item.name}>
          <header><small>ŒUVRE Nº {String(index + 1).padStart(2, "0")}</small><b>{item.type}</b></header>
          <h3>{item.name}</h3><div className="card-image"><Image src={item.image} alt={`Crepe ${item.name}`} fill sizes="(max-width: 800px) 100vw, 33vw" /></div>
          <footer><p>{item.text}</p><div><strong>{item.price}</strong><a href={brand.orderUrl}>Quero este ↗</a></div></footer>
        </article>)}</div>
      </div>
    </section>
  );
}
