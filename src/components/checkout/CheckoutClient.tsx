"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { getServerCart, loadCart, saveCart, subscribeToCart } from "@/lib/cart-storage";
import { getCartLine, getCartTotal, money, type CartItem } from "@/lib/menu";

type FulfillmentMethod = "pickup" | "delivery";
type CustomerForm = { name: string; email: string; phone: string; street: string; number: string; neighborhood: string; city: string };

const emptyCustomer: CustomerForm = { name: "", email: "", phone: "", street: "", number: "", neighborhood: "", city: "" };

export function CheckoutClient() {
  const cart = useSyncExternalStore(subscribeToCart, loadCart, getServerCart);
  const [method, setMethod] = useState<FulfillmentMethod>("pickup");
  const [customer, setCustomer] = useState<CustomerForm>(emptyCustomer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const total = useMemo(() => getCartTotal(cart), [cart]);

  const updateCart = (nextCart: CartItem[]) => {
    saveCart(nextCart);
  };

  const updateQuantity = (index: number, change: number) => {
    const current = cart[index];
    if (!current) return;
    const quantity = current.quantity + change;
    if (quantity < 1) return updateCart(cart.filter((_, itemIndex) => itemIndex !== index));
    updateCart(cart.map((item, itemIndex) => itemIndex === index ? { ...item, quantity } : item));
  };

  const updateCustomer = (field: keyof CustomerForm, value: string) => setCustomer((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/checkout/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customer, fulfillment: { method, ...customer } }),
      });
      const result = await response.json() as { checkoutUrl?: string; error?: string };
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error ?? "Não foi possível iniciar o pagamento.");
      window.location.assign(result.checkoutUrl);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível iniciar o pagamento.");
      setIsSubmitting(false);
    }
  };

  return <main className="checkout-page">
    <nav className="checkout-nav shell"><Link href="/crepes" aria-label="Voltar ao cardápio">J&apos;AIME</Link><span>SEU PEDIDO</span></nav>
    <section className="checkout-shell shell">
      <header className="checkout-heading"><p>QUASE LÁ</p><h1>FINALIZE<br />SUA OBRA.</h1><Link href="/crepes#cardapio">Voltar ao cardápio</Link></header>
      {!cart.length ? <section className="checkout-empty"><h2>SEU CARRINHO ESTÁ VAZIO.</h2><p>Escolha seus crepes e volte para concluir o pedido.</p><Link href="/crepes#cardapio">ESCOLHER CREPES</Link></section> : <form className="checkout-layout" onSubmit={submit}>
        <section className="checkout-form" aria-labelledby="delivery-title">
          <fieldset className="checkout-fieldset"><legend id="delivery-title">COMO VOCÊ QUER RECEBER?</legend><div className="checkout-methods"><label><input type="radio" name="method" value="pickup" checked={method === "pickup"} onChange={() => setMethod("pickup")} /><span><b>RETIRADA</b><small>Você retira na J&apos;aime.</small></span></label><label><input type="radio" name="method" value="delivery" checked={method === "delivery"} onChange={() => setMethod("delivery")} /><span><b>ENTREGA</b><small>Levamos até você.</small></span></label></div></fieldset>
          <fieldset className="checkout-fieldset"><legend>SEUS DADOS</legend><div className="checkout-fields"><label>Nome completo<input required value={customer.name} onChange={(event) => updateCustomer("name", event.target.value)} autoComplete="name" /></label><label>E-mail<input required type="email" value={customer.email} onChange={(event) => updateCustomer("email", event.target.value)} autoComplete="email" /></label><label>WhatsApp<input required type="tel" value={customer.phone} onChange={(event) => updateCustomer("phone", event.target.value)} autoComplete="tel" inputMode="tel" /></label></div></fieldset>
          {method === "delivery" ? <fieldset className="checkout-fieldset"><legend>ENDEREÇO DE ENTREGA</legend><div className="checkout-fields checkout-address"><label>Rua<input required value={customer.street} onChange={(event) => updateCustomer("street", event.target.value)} autoComplete="street-address" /></label><label>Número<input required value={customer.number} onChange={(event) => updateCustomer("number", event.target.value)} autoComplete="address-line2" /></label><label>Bairro<input required value={customer.neighborhood} onChange={(event) => updateCustomer("neighborhood", event.target.value)} autoComplete="address-level3" /></label><label>Cidade<input required value={customer.city} onChange={(event) => updateCustomer("city", event.target.value)} autoComplete="address-level2" /></label></div><p className="checkout-note">A taxa de entrega será definida antes da publicação do checkout.</p></fieldset> : null}
        </section>
        <aside className="checkout-summary" aria-label="Resumo do pedido"><h2>SEU PEDIDO</h2><ul>{cart.map((item, index) => { const line = getCartLine(item); return <li key={`${item.kind}-${index}`}><div><strong>{line.title}</strong><span>{line.description}</span></div><div className="checkout-quantity"><button type="button" onClick={() => updateQuantity(index, -1)} aria-label={`Remover uma unidade de ${line.title}`}>−</button><b>{item.quantity}</b><button type="button" onClick={() => updateQuantity(index, 1)} aria-label={`Adicionar uma unidade de ${line.title}`}>+</button></div><em>{money(line.unitPrice * item.quantity)}</em></li>; })}</ul><div className="checkout-total"><span>TOTAL</span><strong>{money(total)}</strong></div>{error ? <p className="checkout-error" role="alert">{error}</p> : null}<button className="checkout-pay" disabled={isSubmitting}>{isSubmitting ? "PREPARANDO PAGAMENTO..." : "IR PARA PAGAMENTO SEGURO"}</button><p className="checkout-security">Você será encaminhado ao ambiente seguro do Mercado Pago para concluir o pagamento.</p></aside>
      </form>}
    </section>
  </main>;
}

