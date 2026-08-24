"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { menuCrepes, money } from "@/lib/menu";

type Section = "operation" | "orders" | "menu";
type OrderStatus = "awaiting_payment" | "received" | "in_preparation" | "ready" | "out_for_delivery" | "completed";
type DemoOrder = { id: string; customer: string; channel: "Entrega" | "Retirada"; status: OrderStatus; payment: "Pago" | "Pendente"; total: number; created: string; items: string[]; note?: string };

const statusCopy: Record<OrderStatus, string> = {
  awaiting_payment: "Aguardando pagamento",
  received: "Recebido",
  in_preparation: "Em preparo",
  ready: "Pronto",
  out_for_delivery: "Em entrega",
  completed: "Concluído",
};

const statusFlow: OrderStatus[] = ["awaiting_payment", "received", "in_preparation", "ready", "out_for_delivery", "completed"];
const demoOrders: DemoOrder[] = [
  { id: "#1048", customer: "Luiza Martins", channel: "Entrega", status: "in_preparation", payment: "Pago", total: 64.98, created: "12:42", items: ["Monet", "Lucie"], note: "Sem cebola roxa." },
  { id: "#1047", customer: "Renata Alves", channel: "Retirada", status: "received", payment: "Pago", total: 44.99, created: "12:35", items: ["Matisse"] },
  { id: "#1046", customer: "Paulo Henrique", channel: "Entrega", status: "ready", payment: "Pago", total: 58.99, created: "12:27", items: ["Crêpe personalizado salgado"], note: "Campainha 72." },
  { id: "#1045", customer: "Helena Costa", channel: "Retirada", status: "awaiting_payment", payment: "Pendente", total: 40.99, created: "12:19", items: ["Lucie"] },
];

function Icon({ name }: { name: "grid" | "receipt" | "menu" | "box" | "users" | "settings" | "arrow" | "logout" | "check" }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    box: <><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></>,
    users: <><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11a4 4 0 0 0 0-8M21 20v-2a4 4 0 0 0-3-3.87" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.1 2.1-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20h-3v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2.1-2.1.06-.06A1.65 1.65 0 0 0 7.26 15a1.65 1.65 0 0 0-1.51-1H5.66v-3h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.1-2.1.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V4.81h3v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.1 2.1-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1h.09v3h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function ManagementConsole({ profile, demo = false }: { profile?: { display_name: string | null; role: string }; demo?: boolean }) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("operation");
  const [orders, setOrders] = useState(demoOrders);
  const [selectedId, setSelectedId] = useState(demoOrders[0].id);
  const [products, setProducts] = useState(() => menuCrepes.map((item) => ({ ...item, available: true })));
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0];
  const preparing = orders.filter((order) => order.status === "in_preparation").length;
  const ready = orders.filter((order) => order.status === "ready").length;
  const paid = orders.filter((order) => order.payment === "Pago").reduce((total, order) => total + order.total, 0);
  const name = profile?.display_name ?? "Equipe J'aime";

  const moveOrder = (id: string) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order;
      const next = statusFlow[Math.min(statusFlow.indexOf(order.status) + 1, statusFlow.length - 1)];
      return { ...order, status: next };
    }));
  };
  const updateProduct = (index: number, field: "price" | "available", value: number | boolean) => {
    setProducts((current) => current.map((product, productIndex) => productIndex === index ? { ...product, [field]: value } : product));
  };
  const signOut = async () => {
    if (demo) return;
    await fetch("/api/erp/session", { method: "DELETE" });
    router.push("/gestao/login");
  };
  const visibleOrders = useMemo(() => section === "orders" ? orders : orders.filter((order) => order.status !== "completed"), [orders, section]);

  return <main className="erp-shell">
    <aside className="erp-rail"><a className="erp-logo" href="/crepes">J&apos;AIME<span>GESTÃO</span></a><nav aria-label="Navegação do ERP"><button className={section === "operation" ? "is-active" : ""} onClick={() => setSection("operation")}><Icon name="grid" /><span>Operação</span></button><button className={section === "orders" ? "is-active" : ""} onClick={() => setSection("orders")}><Icon name="receipt" /><span>Pedidos</span><b>{orders.filter((order) => order.status !== "completed").length}</b></button><button className={section === "menu" ? "is-active" : ""} onClick={() => setSection("menu")}><Icon name="menu" /><span>Cardápio</span></button><button disabled><Icon name="box" /><span>Estoque</span><small>em breve</small></button><button disabled><Icon name="users" /><span>Clientes</span><small>em breve</small></button><button disabled><Icon name="settings" /><span>Ajustes</span><small>em breve</small></button></nav><div className="erp-rail-user"><span>{name.slice(0, 1).toUpperCase()}</span><div><b>{name}</b><small>{profile?.role ?? "Modo demonstração"}</small></div><button onClick={signOut} aria-label={demo ? "Modo demonstração" : "Sair do ERP"} disabled={demo}><Icon name="logout" /></button></div></aside>

    <section className="erp-workspace">
      {demo ? <div className="erp-demo-banner"><Icon name="check" /><span>Modo demonstração: pedidos e alterações abaixo não são dados reais.</span><a href="/gestao/login">Conectar Supabase</a></div> : null}
      <header className="erp-topbar"><div><p>{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p><h1>{section === "operation" ? "A CASA ESTÁ EM SERVIÇO." : section === "orders" ? "TODOS OS PEDIDOS." : "O CARDÁPIO EM CENA."}</h1></div><div className="erp-topbar-actions"><button type="button" className="erp-date">Hoje</button><button type="button" className="erp-primary" onClick={() => setSection("orders")}>VER PEDIDOS <Icon name="arrow" /></button></div></header>

      {section !== "menu" ? <div className="erp-service-layout">
        <section className="erp-ticket-stream" aria-labelledby="order-stream-title"><header><div><h2 id="order-stream-title">FILA DE PRODUÇÃO</h2><span>{visibleOrders.length} pedidos em acompanhamento</span></div><div className="erp-live"><i />Atualiza com o pagamento</div></header><ol>{visibleOrders.map((order) => <li key={order.id}><button className={`erp-ticket is-${order.status} ${selectedOrder.id === order.id ? "is-selected" : ""}`} onClick={() => setSelectedId(order.id)}><div className="erp-ticket-top"><span>{order.id}</span><time>{order.created}</time><b className={order.payment === "Pago" ? "is-paid" : ""}>{order.payment}</b></div><strong>{order.customer}</strong><small>{order.items.join(" · ")}</small><footer><span>{order.channel}</span><em>{money(order.total)}</em><i>{statusCopy[order.status]}</i></footer></button></li>)}</ol></section>
        <aside className="erp-order-focus" aria-live="polite"><header><span>PEDIDO EM FOCO</span><b>{selectedOrder.id}</b></header><div className="erp-focus-name"><h2>{selectedOrder.customer}</h2><p>{selectedOrder.channel} · {selectedOrder.created}</p></div><ul>{selectedOrder.items.map((item) => <li key={item}><span>1×</span>{item}</li>)}</ul>{selectedOrder.note ? <p className="erp-note">{selectedOrder.note}</p> : null}<div className="erp-focus-total"><span>Total</span><strong>{money(selectedOrder.total)}</strong></div><div className="erp-status-line"><i className={`is-${selectedOrder.status}`} /><span>{statusCopy[selectedOrder.status]}</span></div><button className="erp-advance" type="button" onClick={() => moveOrder(selectedOrder.id)} disabled={selectedOrder.status === "completed"}>{selectedOrder.status === "completed" ? "PEDIDO CONCLUÍDO" : <>AVANÇAR PEDIDO <Icon name="arrow" /></>}</button></aside>
        <aside className="erp-shift-summary"><section><span>Em preparo</span><strong>{preparing}</strong><p>Prioridade da cozinha agora.</p></section><section><span>Prontos</span><strong>{ready}</strong><p>Esperando retirada ou entrega.</p></section><section><span>Faturado hoje</span><strong>{money(paid)}</strong><p>Somente pedidos aprovados.</p></section><button type="button" onClick={() => setSection("menu")}>GERENCIAR CARDÁPIO <Icon name="arrow" /></button></aside>
      </div> : <section className="erp-menu-editor"><header><div><h2>CREPES DISPONÍVEIS</h2><p>Controle o que aparece no site. As alterações demonstrativas ficam apenas nesta tela até o Supabase estar conectado.</p></div><button type="button" className="erp-primary" disabled title="A criação de produtos será ativada ao conectar a base real.">NOVO CREPE · EM BREVE <Icon name="arrow" /></button></header><div className="erp-product-table" role="table" aria-label="Editor de cardápio"><div className="erp-product-head" role="row"><span>Obra</span><span>Categoria</span><span>Preço</span><span>Disponibilidade</span></div>{products.map((product, index) => <div className="erp-product-row" role="row" key={product.id}><div><b>{product.name}</b><small>{product.highlight}</small></div><span>{product.type}</span><label><span className="sr-only">Preço de {product.name}</span><input aria-label={`Preço de ${product.name}`} type="number" min="0" step="0.01" value={product.price} onChange={(event) => updateProduct(index, "price", Number(event.target.value))} /><em>R$</em></label><button type="button" className={`erp-toggle ${product.available ? "is-on" : ""}`} onClick={() => updateProduct(index, "available", !product.available)} aria-pressed={product.available}><i />{product.available ? "Disponível" : "Indisponível"}</button></div>)}</div></section>}
    </section>
  </main>;
}

