import { createHmac, timingSafeEqual } from "node:crypto";
import { syncOrderPayment } from "@/lib/erp/orders";

function parseSignature(signature: string) {
  let timestamp: string | undefined;
  let hash: string | undefined;

  for (const entry of signature.split(",")) {
    const separator = entry.indexOf("=");
    if (separator < 0) continue;
    const key = entry.slice(0, separator).trim();
    const value = entry.slice(separator + 1).trim();
    if (key === "ts") timestamp = value;
    if (key === "v1") hash = value;
  }

  return { timestamp, hash };
}

function sameSignature(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook não configurado.", { status: 503 });

  const url = new URL(request.url);
  const payload = await request.json().catch(() => null) as { data?: { id?: string | number } } | null;
  const dataId = url.searchParams.get("data.id") ?? payload?.data?.id?.toString();
  const xSignature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");

  if (!dataId || !xSignature || !requestId) return new Response("Assinatura ausente.", { status: 401 });

  const { timestamp, hash } = parseSignature(xSignature);
  if (!timestamp || !hash) return new Response("Assinatura inválida.", { status: 401 });

  const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  if (!sameSignature(expected, hash)) return new Response("Assinatura inválida.", { status: 401 });

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) return new Response("Pagamento não configurado.", { status: 503 });

  const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!paymentResponse.ok) return new Response("Pagamento não localizado.", { status: 502 });

  const payment = await paymentResponse.json() as { id?: string | number; status?: string; external_reference?: string };
  const orderId = payment.external_reference;
  if (orderId && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(orderId) && payment.id && payment.status) {
    try {
      await syncOrderPayment({ orderId, paymentId: String(payment.id), paymentStatus: payment.status });
    } catch {
      return new Response("ERP indisponível.", { status: 503 });
    }
  }

  return Response.json({ received: true });
}

