import type { Metadata } from "next";

import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Finalizar pedido | J'aime Creperia",
  description: "Revise seu pedido e conclua o pagamento com segurança.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

