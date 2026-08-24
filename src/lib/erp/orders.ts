import { getCartLine, type CartItem } from "@/lib/menu";
import { hasSupabaseAdminConfig, supabaseAdmin } from "@/lib/erp/supabase";

type CheckoutCustomer = { name: string; email: string; phone: string };
type CheckoutFulfillment = { method: "pickup" | "delivery"; street: string; number: string; neighborhood: string; city: string };
type ErpOrder = { id: string; order_number: number };

export async function createErpOrder(input: { cart: CartItem[]; customer: CheckoutCustomer; fulfillment: CheckoutFulfillment; subtotal: number }) {
  if (!hasSupabaseAdminConfig()) return null;

  const address = input.fulfillment.method === "delivery" ? {
    street: input.fulfillment.street,
    number: input.fulfillment.number,
    neighborhood: input.fulfillment.neighborhood,
    city: input.fulfillment.city,
  } : {};

  return supabaseAdmin<ErpOrder>("rpc/create_order_with_items", {
    method: "POST",
    body: JSON.stringify({
      p_order: {
        fulfillment_method: input.fulfillment.method,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone,
        delivery_address: address,
        subtotal: input.subtotal,
        total: input.subtotal,
      },
      p_items: input.cart.map((item) => {
        const line = getCartLine(item);
        return {
          product_id: item.kind === "menu" ? item.id : null,
          title: line.title,
          description: line.description,
          quantity: item.quantity,
          unit_price: line.unitPrice,
          modifiers: item.kind === "custom" ? item.ingredients : [],
        };
      }),
    }),
  });
}

export async function markOrderWaitingForPayment(orderId: string, preferenceId: string) {
  if (!hasSupabaseAdminConfig()) return;
  await supabaseAdmin("rpc/update_order_status", {
    method: "POST",
    body: JSON.stringify({
      p_order_id: orderId,
      p_status: "awaiting_payment",
      p_note: "Checkout Mercado Pago iniciado.",
      p_preference_id: preferenceId,
    }),
  });
}

export async function syncOrderPayment(input: { orderId: string; paymentId: string; paymentStatus: string }) {
  if (!hasSupabaseAdminConfig()) return;

  const approved = input.paymentStatus === "approved";
  const failed = ["rejected", "cancelled", "refunded", "charged_back"].includes(input.paymentStatus);
  await supabaseAdmin("rpc/update_order_status", {
    method: "POST",
    body: JSON.stringify({
      p_order_id: input.orderId,
      p_status: approved ? "received" : failed ? "cancelled" : "awaiting_payment",
      p_note: approved ? "Pagamento aprovado." : failed ? "Pagamento não concluído." : "Pagamento em análise.",
      p_payment_status: approved ? "approved" : failed ? "failed" : "pending",
      p_payment_id: input.paymentId,
    }),
  });
}

