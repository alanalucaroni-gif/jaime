import { getCartLine, getCartTotal, normalizeCart } from "@/lib/menu";
import { createErpOrder, markOrderWaitingForPayment } from "@/lib/erp/orders";

type Customer = { name?: unknown; email?: unknown; phone?: unknown };
type Fulfillment = { method?: unknown; street?: unknown; number?: unknown; neighborhood?: unknown; city?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function splitName(name: string) {
  const [firstName, ...rest] = name.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

export async function POST(request: Request) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return Response.json({ error: "O pagamento de teste ainda não foi configurado." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Não foi possível ler o pedido." }, { status: 400 });
  }

  if (!isRecord(payload)) return Response.json({ error: "Pedido inválido." }, { status: 400 });

  const cart = normalizeCart(payload.cart);
  if (!cart.length) return Response.json({ error: "Adicione pelo menos um crepe para continuar." }, { status: 400 });

  const customer = isRecord(payload.customer) ? payload.customer as Customer : {};
  const fulfillment = isRecord(payload.fulfillment) ? payload.fulfillment as Fulfillment : {};
  const name = text(customer.name, 100);
  const email = text(customer.email, 160);
  const phone = text(customer.phone, 30);
  const method = fulfillment.method === "delivery" ? "delivery" : fulfillment.method === "pickup" ? "pickup" : null;

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !phone || !method) {
    return Response.json({ error: "Preencha seus dados e escolha entrega ou retirada." }, { status: 400 });
  }

  const address = {
    street: text(fulfillment.street, 120),
    number: text(fulfillment.number, 20),
    neighborhood: text(fulfillment.neighborhood, 80),
    city: text(fulfillment.city, 80),
  };
  if (method === "delivery" && Object.values(address).some((value) => !value)) {
    return Response.json({ error: "Informe o endereço completo para a entrega." }, { status: 400 });
  }

  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin).replace(/\/$/, "");
  const { firstName, lastName } = splitName(name);
  const isProduction = process.env.MERCADO_PAGO_MODE === "production";
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const notificationUrl = webhookSecret && origin.startsWith("https://")
    ? `${origin}/api/mercado-pago/webhook?source_news=webhooks`
    : undefined;
  let erpOrder: { id: string } | null = null;

  try {
    erpOrder = await createErpOrder({
      cart,
      customer: { name, email, phone },
      fulfillment: { method, ...address },
      subtotal: getCartTotal(cart),
    });
  } catch {
    return Response.json({ error: "Não foi possível registrar o pedido no ERP. Tente novamente em instantes." }, { status: 503 });
  }

  const externalReference = erpOrder?.id ?? crypto.randomUUID();

  const preferenceResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      items: cart.map((item) => {
        const line = getCartLine(item);
        return {
          id: item.kind === "menu" ? item.id : `custom-${item.type.toLowerCase()}`,
          title: line.title,
          description: line.description,
          quantity: item.quantity,
          currency_id: "BRL",
          unit_price: line.unitPrice,
        };
      }),
      payer: {
        name: firstName,
        surname: lastName || undefined,
        email,
        phone: { number: phone.replace(/\D/g, "") },
      },
      external_reference: externalReference,
      back_urls: {
        success: `${origin}/checkout/retorno?status=success`,
        pending: `${origin}/checkout/retorno?status=pending`,
        failure: `${origin}/checkout/retorno?status=failure`,
      },
      auto_return: "approved",
      notification_url: notificationUrl,
      metadata: {
        fulfillment: method,
        address: method === "delivery" ? address : undefined,
      },
    }),
    cache: "no-store",
  });

  if (!preferenceResponse.ok) {
    return Response.json({ error: "Não foi possível iniciar o pagamento. Tente novamente em instantes." }, { status: 502 });
  }

  const preference = await preferenceResponse.json() as { id?: string; init_point?: string; sandbox_init_point?: string };
  const checkoutUrl = isProduction ? preference.init_point : preference.sandbox_init_point ?? preference.init_point;
  if (!checkoutUrl) return Response.json({ error: "O Mercado Pago não retornou um link de pagamento." }, { status: 502 });

  if (erpOrder && preference.id) {
    try {
      await markOrderWaitingForPayment(erpOrder.id, preference.id);
    } catch {
      return Response.json({ error: "O pedido foi iniciado, mas o ERP não conseguiu registrar o pagamento. Tente novamente." }, { status: 503 });
    }
  }

  return Response.json({ checkoutUrl });
}

