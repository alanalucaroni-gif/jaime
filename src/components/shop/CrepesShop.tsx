"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { brand } from "@/config/brand";
import { getServerCart, loadCart, saveCart, subscribeToCart } from "@/lib/cart-storage";
import {
  builderOptions,
  customBasePrice,
  customBases,
  getCartTotal,
  getCustomPrice,
  menuCrepes,
  money,
  type CartItem,
  type CustomCrepeType,
  type MenuCrepeId,
} from "@/lib/menu";

const steps = [
  { number: "01", label: "Crepes salgados" },
  { number: "02", label: "Crepes doces" },
  { number: "03", label: "Monte seu crepe" },
];

const builderVisuals: Record<CustomCrepeType, { image: string; alt: string }> = {
  Salgado: { image: "/images/jaime/crepe-salgado-builder-v3.png", alt: "Crepe salgado J'aime personalizado" },
  Doce: { image: "/images/jaime/crepe-doce-builder-v3.png", alt: "Crepe doce J'aime personalizado" },
};

export function CrepesShop() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const cart = useSyncExternalStore(subscribeToCart, loadCart, getServerCart);
  const [customType, setCustomType] = useState<CustomCrepeType>("Salgado");
  const [previousCustomType, setPreviousCustomType] = useState<CustomCrepeType | null>(null);
  const [customDough, setCustomDough] = useState(customBases.Salgado[0]);
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);

  const visibleCrepes = menuCrepes.filter((item) => item.type === (activeStep === 0 ? "Salgado" : "Doce"));
  const total = useMemo(() => getCartTotal(cart), [cart]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const customTotal = getCustomPrice(customType, customIngredients);
  const activeBuilderVisual = builderVisuals[customType];
  const previousBuilderVisual = previousCustomType === null ? null : builderVisuals[previousCustomType];

  useEffect(() => {
    if (previousCustomType === null) return;
    const timeout = window.setTimeout(() => setPreviousCustomType(null), 260);
    return () => window.clearTimeout(timeout);
  }, [previousCustomType]);

  const updateCart = (nextCart: CartItem[]) => {
    saveCart(nextCart);
  };

  const hasMenuCrepe = (id: MenuCrepeId) => cart.some((item) => item.kind === "menu" && item.id === id);
  const toggleMenuCrepe = (id: MenuCrepeId) => {
    updateCart(hasMenuCrepe(id) ? cart.filter((item) => item.kind !== "menu" || item.id !== id) : [...cart, { kind: "menu", id, quantity: 1 }]);
  };
  const goToStep = (step: number) => {
    setActiveStep(step);
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const changeCustomType = (type: CustomCrepeType) => {
    setPreviousCustomType(type === customType ? null : customType);
    setCustomType(type);
    setCustomDough(customBases[type][0]);
    setCustomIngredients([]);
  };
  const toggleCustomIngredient = (name: string) => {
    setCustomIngredients((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };
  const checkoutCustomCrepe = () => {
    updateCart([...cart, { kind: "custom", type: customType, dough: customDough, ingredients: customIngredients, quantity: 1 }]);
    router.push("/checkout");
  };

  return <main className="shop-page">
    <nav className="shop-nav shell"><Link href="/" aria-label="Voltar para o início"><Image src="/images/jaime/logo.png" alt="J'aime" width={170} height={90} priority /></Link><div><Link href="/">Início</Link><Link className="shop-pill" href={brand.orderUrl}>Pedir agora ↗</Link></div></nav>
    <section className="shop-hero shop-hero-intro" aria-labelledby="shop-hero-title">
      <div className="shop-hero-copy">
        <h1 id="shop-hero-title">UM CREPE.<br /><em>UMA OBRA</em><br />SÓ SUA.</h1>
        <p>Escolha sabores, combine ingredientes e peça do seu jeito.</p>
        <Link href="#cardapio">COMEÇAR PEDIDO <span aria-hidden="true">↓</span></Link>
      </div>
      <div className="shop-hero-visual" aria-hidden="true">
        <video src="/images/jaime/jaime.mp4" autoPlay muted loop playsInline preload="metadata" />
      </div>
    </section>

    <section className="shop-journey" id="cardapio">
      <header className="shell shop-menu-title"><div><p>LE MENU</p><h2>ESCOLHA<br />SEU CAMINHO</h2></div><span>3 etapas</span></header>
      <div className="shop-steps shell" aria-label="Etapas do cardápio">{steps.map((step, index) => <button type="button" key={step.number} className={activeStep === index ? "is-active" : ""} onClick={() => goToStep(index)} aria-current={activeStep === index ? "step" : undefined}><span>{step.number}</span><b>{step.label}</b></button>)}</div>

      {activeStep < 2 ? <div className="shop-stage shell">
        <div className="shop-stage-head"><p>ÉTAPE {steps[activeStep].number}</p><h2>{steps[activeStep].label}</h2><span>{visibleCrepes.length} obras</span></div>
        <div className="shop-grid">{visibleCrepes.map((item, index) => {
          const isInCart = hasMenuCrepe(item.id);
          return <article className="shop-card shop-ref-card" key={item.id}>
            <div className={`shop-card-visual shop-${item.color}`}><div className="shop-checker" aria-hidden="true" /><span>ŒUVRE Nº {String(index + 1).padStart(2, "0")}</span><button type="button" className="shop-card-add" onClick={() => toggleMenuCrepe(item.id)} aria-label={`${isInCart ? "Remover" : "Adicionar"} ${item.name} ${isInCart ? "do" : "ao"} carrinho`} aria-pressed={isInCart}>{isInCart ? "✓" : "+"}</button><Image src={item.image} alt={`Crepe ${item.name}`} fill sizes="(max-width:900px) 100vw, 33vw" />
              <div className="shop-hover-details"><div><b>DETALHES RÁPIDOS</b><span>{item.time}</span></div><dl><div><dt>Massa</dt><dd>{item.base}</dd></div><div><dt>Recheio</dt><dd>{item.highlight}</dd></div><div><dt>Tipo</dt><dd>{item.type}</dd></div></dl><p><span>Calorias: {item.calories}</span><span>Proteína: {item.protein}g</span></p></div>
              <div className="shop-ref-meta"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div>
            </div>
          </article>;
        })}</div>
        <div className="shop-stage-actions"><button type="button" disabled={activeStep === 0} onClick={() => goToStep(activeStep - 1)}>← VOLTAR</button><button type="button" onClick={() => goToStep(activeStep + 1)}>PRÓXIMA ETAPA →</button></div>
      </div> : <div className="shop-builder shell">
        <div className={`shop-builder-copy is-${customType.toLowerCase()}`}><p>ÉTAPE 03</p><h2>MONTE SUA<br />PRÓPRIA OBRA</h2><span>Escolha o tipo e combine quantos ingredientes quiser. A animação e o total mudam na hora.</span><div className="shop-builder-product">{previousBuilderVisual ? <div className="shop-builder-product__image is-leaving" aria-hidden="true"><Image src={previousBuilderVisual.image} alt="" fill sizes="(max-width:900px) 80vw, 42vw" /></div> : null}<div className="shop-builder-product__image is-entering" key={activeBuilderVisual.image}><Image src={activeBuilderVisual.image} alt={activeBuilderVisual.alt} fill sizes="(max-width:900px) 80vw, 42vw" /></div></div></div>
        <div className="shop-builder-form">
          <fieldset className="shop-type-picker"><legend><span>01</span> tipo do crepe</legend><div>{(["Salgado", "Doce"] as CustomCrepeType[]).map((type) => <button type="button" key={type} className={customType === type ? "is-selected" : ""} onClick={() => changeCustomType(type)}>{type}<b>{customType === type ? "✓" : "+"}</b></button>)}</div></fieldset>
          <fieldset><legend><span>02</span> massa · {money(customBasePrice)}</legend><div>{customBases[customType].map((dough) => <button type="button" key={dough} className={customDough === dough ? "is-selected" : ""} onClick={() => setCustomDough(dough)}>{dough}<b>{customDough === dough ? "✓" : "+"}</b></button>)}</div></fieldset>
          <fieldset><legend><span>03</span> ingredientes</legend><div>{builderOptions[customType].map((option) => <button type="button" key={option.name} className={customIngredients.includes(option.name) ? "is-selected" : ""} onClick={() => toggleCustomIngredient(option.name)} aria-pressed={customIngredients.includes(option.name)}><span>{option.name}<small>+ {money(option.price)}</small></span><b>{customIngredients.includes(option.name) ? "✓" : "+"}</b></button>)}</div></fieldset>
          <div className="shop-builder-summary"><p>SUA CRIAÇÃO · {customType.toUpperCase()}</p><strong>{customDough}{customIngredients.length ? ` · ${customIngredients.join(" · ")}` : " · sem adicionais"}</strong><div className="shop-builder-total"><span>TOTAL FINAL</span><b>{money(customTotal)}</b></div><button type="button" onClick={checkoutCustomCrepe}>CONTINUAR PEDIDO ↗</button></div>
        </div>
        <div className="shop-stage-actions"><button type="button" onClick={() => goToStep(1)}>← VOLTAR</button></div>
      </div>}
    </section>

    <aside className={`shop-cart ${cartCount ? "is-visible" : ""}`} aria-live="polite"><span>{cartCount}</span><div><b>SUA SELEÇÃO</b><strong>{money(total)}</strong></div><Link href="/checkout">FINALIZAR ↗</Link></aside>
    <section className="shop-cta"><div><p>FAIT AVEC AMOUR</p><h2>JÁ ESCOLHEU<br />SUA OBRA?</h2><Link href={brand.orderUrl}>PEDIR AGORA ↗</Link></div><div><Image src="/images/jaime/savory-crepe-transparent-v1.png" alt="Crepe salgado J'aime" fill sizes="50vw" /></div></section>
  </main>;
}

