"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/config/brand";

const crepes = [
  { name: "Monet", type: "Salgado", price: 44.99, time: "12–15 min", base: "Tradicional", highlight: "Carne + bacon", image: "/images/jaime/monet.png", color: "green" },
  { name: "Matisse", type: "Salgado", price: 44.99, time: "12–15 min", base: "Tradicional", highlight: "Frango cremoso", image: "/images/jaime/matisse.png", color: "red" },
  { name: "Chapelle", type: "Vegetariano", price: 42.99, time: "10–12 min", base: "Tradicional", highlight: "Brócolis", image: "/images/jaime/chapelle.png", color: "navy" },
  { name: "Lucie", type: "Doce", price: 40.99, time: "10–12 min", base: "Baunilha", highlight: "KitKat", image: "/images/jaime/lucie.png", color: "red" },
  { name: "Margot", type: "Doce", price: 47.99, time: "10–12 min", base: "Chocolate", highlight: "Morango + Oreo", image: "/images/jaime/margot.png", color: "cream" },
  { name: "Cezanne", type: "Salgado", price: 42.99, time: "12–14 min", base: "Tradicional", highlight: "Bacon + Doritos", image: "/images/jaime/cezanne.png", color: "navy" },
];

export function CrepesShop() {
  const [cart, setCart] = useState<string[]>([]);
  const total = crepes.filter((item) => cart.includes(item.name)).reduce((sum, item) => sum + item.price, 0);

  const toggle = (name: string) => setCart((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return <main className="shop-page">
    <nav className="shop-nav shell"><Link href="/" aria-label="Voltar para o início"><Image src="/images/jaime/logo.png" alt="J'aime" width={170} height={90} priority/></Link><div><Link href="/">Início</Link><a className="shop-pill" href={brand.orderUrl}>Pedir agora ↗</a></div></nav>
    <section className="shop-hero"><div className="shop-hero-bg"><Image src="/images/jaime/hero-campaign-v2.png" alt="Crepe J'aime" fill priority sizes="100vw"/></div><div className="shop-hero-overlay"/><h1><span>CREPE</span><span>COM VONTADE.</span></h1><div className="shop-hero-product"><Image src="/images/jaime/hero-full-cone-transparent-v4.png" alt="Crepe doce J'aime" fill priority sizes="60vw"/></div><svg viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70c250 110 420-50 690 22 270 72 480-70 750 12v76H0Z"/></svg></section>

    <section className="shop-menu"><header className="shell shop-menu-title"><div><p>LE MEILLEUR</p><h2>NOSSAS OBRAS<br/>MAIS DESEJADAS</h2></div><span>{crepes.length} sabores</span></header><div className="shop-grid shell">{crepes.map((item, index) => <article className="shop-card" key={item.name}><div className={`shop-card-visual shop-${item.color}`}><span>ŒUVRE Nº {String(index + 1).padStart(2, "0")}</span><Image src={item.image} alt={`Crepe ${item.name}`} fill sizes="(max-width:900px) 100vw, 33vw"/></div><div className="shop-card-body"><div className="shop-quick"><b>DETALHES RÁPIDOS</b><span>{item.time}</span></div><dl><div><dt>Massa</dt><dd>{item.base}</dd></div><div><dt>Tipo</dt><dd>{item.type}</dd></div><div><dt>Destaque</dt><dd>{item.highlight}</dd></div></dl><div className="shop-card-foot"><div><h3>{item.name}</h3><strong>{item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div><button onClick={() => toggle(item.name)} aria-pressed={cart.includes(item.name)}>{cart.includes(item.name) ? "REMOVER" : "ADICIONAR"} <b>{cart.includes(item.name) ? "−" : "+"}</b></button></div></div></article>)}</div></section>

    <aside className={`shop-cart ${cart.length ? "is-visible" : ""}`}><span>{cart.length}</span><div><b>SUA SELEÇÃO</b><strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div><a href={brand.orderUrl}>FINALIZAR ↗</a></aside>
    <section className="shop-cta"><div><p>FAIT AVEC AMOUR</p><h2>JÁ ESCOLHEU<br/>SUA OBRA?</h2><a href={brand.orderUrl}>PEDIR AGORA ↗</a></div><div><Image src="/images/jaime/savory-crepe-transparent-v1.png" alt="Crepe salgado J'aime" fill sizes="50vw"/></div></section>
  </main>;
}
