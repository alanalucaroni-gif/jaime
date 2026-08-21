"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/config/brand";

type Crepe = { name: string; type: "Salgado" | "Doce"; price: number; time: string; base: string; highlight: string; calories: number; protein: number; image: string; color: string };
type CustomType = "Salgado" | "Doce";
type BuilderOption = { name: string; price: number };

const crepes: Crepe[] = [
  { name: "Monet", type: "Salgado", price: 44.99, time: "12–15 min", base: "Tradicional", highlight: "Carne + bacon", calories: 720, protein: 32, image: "/images/jaime/monet-cutout-v2.png", color: "green" },
  { name: "Matisse", type: "Salgado", price: 44.99, time: "12–15 min", base: "Tradicional", highlight: "Frango cremoso", calories: 650, protein: 29, image: "/images/jaime/matisse-cutout-v2.png", color: "red" },
  { name: "Chapelle", type: "Salgado", price: 42.99, time: "10–12 min", base: "Tradicional", highlight: "Brócolis", calories: 540, protein: 19, image: "/images/jaime/chapelle-cutout-v2.png", color: "navy" },
  { name: "Cezanne", type: "Salgado", price: 42.99, time: "12–14 min", base: "Tradicional", highlight: "Bacon + Doritos", calories: 760, protein: 26, image: "/images/jaime/cezanne-cutout-v2.png", color: "navy" },
  { name: "Lucie", type: "Doce", price: 40.99, time: "10–12 min", base: "Baunilha", highlight: "KitKat", calories: 680, protein: 12, image: "/images/jaime/lucie-cutout-v2.png", color: "red" },
  { name: "Margot", type: "Doce", price: 47.99, time: "10–12 min", base: "Chocolate", highlight: "Morango + Oreo", calories: 710, protein: 11, image: "/images/jaime/margot-cutout-v2.png", color: "cream" },
];

const customBasePrice = 18;
const builderOptions: Record<CustomType, BuilderOption[]> = {
  Salgado: [
    { name: "Carne moída", price: 7 }, { name: "Frango", price: 7 }, { name: "Calabresa", price: 7 },
    { name: "Bacon", price: 5 }, { name: "Doritos", price: 5 }, { name: "Queijo prato", price: 5 },
    { name: "Requeijão", price: 5 }, { name: "Champignon", price: 5 }, { name: "Cheddar", price: 5 },
    { name: "Muçarela", price: 5 }, { name: "Batata palha", price: 5 }, { name: "Brócolis", price: 5 },
    { name: "Cebola roxa", price: 5 }, { name: "Tomate cereja", price: 5 },
  ],
  Doce: [
    { name: "Chocolate com avelã", price: 9 }, { name: "Chocolate branco", price: 9 }, { name: "Chocolate meio amargo", price: 9 },
    { name: "Frutas vermelhas", price: 9 }, { name: "Suspiro", price: 7 }, { name: "Farofa de Oreo", price: 7 },
    { name: "Kit Kat", price: 7 }, { name: "Ovomaltine", price: 7 }, { name: "Leite em pó", price: 7 },
    { name: "Nuts", price: 7 }, { name: "Morango", price: 7 }, { name: "Confete", price: 7 },
  ],
};

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const steps = [
  { number: "01", label: "Crepes salgados" },
  { number: "02", label: "Crepes doces" },
  { number: "03", label: "Monte seu crepe" },
];

export function CrepesShop() {
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<string[]>([]);
  const [customType, setCustomType] = useState<CustomType>("Salgado");
  const [customDough, setCustomDough] = useState("Tradicional");
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);
  const visibleCrepes = crepes.filter((item) => item.type === (activeStep === 0 ? "Salgado" : "Doce"));
  const total = crepes.filter((item) => cart.includes(item.name)).reduce((sum, item) => sum + item.price, 0);
  const customTotal = customBasePrice + builderOptions[customType].filter((item) => customIngredients.includes(item.name)).reduce((sum, item) => sum + item.price, 0);

  const toggle = (name: string) => setCart((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const goToStep = (step: number) => {
    setActiveStep(step);
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const changeCustomType = (type: CustomType) => {
    setCustomType(type);
    setCustomDough("Tradicional");
    setCustomIngredients([]);
  };
  const toggleCustomIngredient = (name: string) => setCustomIngredients((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return <main className="shop-page">
    <nav className="shop-nav shell"><Link href="/" aria-label="Voltar para o início"><Image src="/images/jaime/logo.png" alt="J'aime" width={170} height={90} priority /></Link><div><Link href="/">Início</Link><a className="shop-pill" href={brand.orderUrl}>Pedir agora ↗</a></div></nav>
    <section className="shop-hero"><div className="shop-hero-bg"><Image src="/images/jaime/hero-campaign-v2.png" alt="Crepe J'aime" fill priority sizes="100vw" /></div><div className="shop-hero-overlay" /><p className="shop-hero-kicker">TRÊS ETAPAS · UMA OBRA</p><h1><span>PEÇA SEU</span><span>CREPE.</span></h1><div className="shop-hero-product"><Image src="/images/jaime/hero-full-cone-transparent-v4.png" alt="Crepe doce J'aime" fill priority sizes="60vw" /></div><svg viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70c250 110 420-50 690 22 270 72 480-70 750 12v76H0Z" /></svg></section>

    <section className="shop-journey" id="cardapio">
      <header className="shell shop-menu-title"><div><p>LE MENU</p><h2>ESCOLHA<br />SEU CAMINHO</h2></div><span>3 etapas</span></header>
      <div className="shop-steps shell" aria-label="Etapas do cardápio">{steps.map((step, index) => <button key={step.number} className={activeStep === index ? "is-active" : ""} onClick={() => goToStep(index)} aria-current={activeStep === index ? "step" : undefined}><span>{step.number}</span><b>{step.label}</b></button>)}</div>

      {activeStep < 2 ? <div className="shop-stage shell">
        <div className="shop-stage-head"><p>ÉTAPE {steps[activeStep].number}</p><h2>{steps[activeStep].label}</h2><span>{visibleCrepes.length} obras</span></div>
        <div className="shop-grid">{visibleCrepes.map((item, index) => <article className="shop-card shop-ref-card" key={item.name}>
          <div className={`shop-card-visual shop-${item.color}`}><div className="shop-checker" aria-hidden="true" /><span>ŒUVRE Nº {String(index + 1).padStart(2, "0")}</span><button className="shop-card-add" onClick={() => toggle(item.name)} aria-label={`${cart.includes(item.name) ? "Remover" : "Adicionar"} ${item.name} ${cart.includes(item.name) ? "do" : "ao"} carrinho`} aria-pressed={cart.includes(item.name)}>{cart.includes(item.name) ? "✓" : "+"}</button><Image src={item.image} alt={`Crepe ${item.name}`} fill sizes="(max-width:900px) 100vw, 33vw" />
            <div className="shop-hover-details"><div><b>DETALHES RÁPIDOS</b><span>{item.time}</span></div><dl><div><dt>Massa</dt><dd>{item.base}</dd></div><div><dt>Recheio</dt><dd>{item.highlight}</dd></div><div><dt>Tipo</dt><dd>{item.type}</dd></div></dl><p><span>Calorias: {item.calories}</span><span>Proteína: {item.protein}g</span></p></div>
            <div className="shop-ref-meta"><h3>{item.name}</h3><strong>{item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
          </div>
        </article>)}</div>
        <div className="shop-stage-actions"><button disabled={activeStep === 0} onClick={() => goToStep(activeStep - 1)}>← VOLTAR</button><button onClick={() => goToStep(activeStep + 1)}>PRÓXIMA ETAPA →</button></div>
      </div> : <div className="shop-builder shell">
        <div className={`shop-builder-copy is-${customType.toLowerCase()}`}><p>ÉTAPE 03</p><h2>MONTE SUA<br />PRÓPRIA OBRA</h2><span>Escolha o tipo e combine quantos ingredientes quiser. A animação e o total mudam na hora.</span><div key={customType} className="shop-builder-product"><Image src={customType === "Doce" ? "/images/jaime/hero-full-cone-transparent-v4.png" : "/images/jaime/savory-crepe-transparent-v1.png"} alt={`Crepe ${customType.toLowerCase()} personalizado J'aime`} fill sizes="(max-width:900px) 80vw, 42vw" /></div></div>
        <div className="shop-builder-form">
          <fieldset className="shop-type-picker"><legend><span>01</span> tipo do crepe</legend><div>{(["Salgado", "Doce"] as CustomType[]).map((type) => <button type="button" key={type} className={customType === type ? "is-selected" : ""} onClick={() => changeCustomType(type)}>{type}<b>{customType === type ? "✓" : "+"}</b></button>)}</div></fieldset>
          <fieldset><legend><span>02</span> massa · {money(customBasePrice)}</legend><div>{(customType === "Doce" ? ["Tradicional", "Chocolate"] : ["Tradicional"]).map((dough) => <button type="button" key={dough} className={customDough === dough ? "is-selected" : ""} onClick={() => setCustomDough(dough)}>{dough}<b>{customDough === dough ? "✓" : "+"}</b></button>)}</div></fieldset>
          <fieldset><legend><span>03</span> ingredientes</legend><div>{builderOptions[customType].map((option) => <button type="button" key={option.name} className={customIngredients.includes(option.name) ? "is-selected" : ""} onClick={() => toggleCustomIngredient(option.name)} aria-pressed={customIngredients.includes(option.name)}><span>{option.name}<small>+ {money(option.price)}</small></span><b>{customIngredients.includes(option.name) ? "✓" : "+"}</b></button>)}</div></fieldset>
          <div className="shop-builder-summary"><p>SUA CRIAÇÃO · {customType.toUpperCase()}</p><strong>{customDough}{customIngredients.length ? ` · ${customIngredients.join(" · ")}` : " · sem adicionais"}</strong><div className="shop-builder-total"><span>TOTAL FINAL</span><b>{money(customTotal)}</b></div><a href={brand.orderUrl}>CONTINUAR PEDIDO ↗</a></div>
        </div>
        <div className="shop-stage-actions"><button onClick={() => goToStep(1)}>← VOLTAR</button></div>
      </div>}
    </section>

    <aside className={`shop-cart ${cart.length ? "is-visible" : ""}`}><span>{cart.length}</span><div><b>SUA SELEÇÃO</b><strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div><a href={brand.orderUrl}>FINALIZAR ↗</a></aside>
    <section className="shop-cta"><div><p>FAIT AVEC AMOUR</p><h2>JÁ ESCOLHEU<br />SUA OBRA?</h2><a href={brand.orderUrl}>PEDIR AGORA ↗</a></div><div><Image src="/images/jaime/savory-crepe-transparent-v1.png" alt="Crepe salgado J'aime" fill sizes="50vw" /></div></section>
  </main>;
}
