import Link from "next/link";

const messages = {
  success: { title: "RETORNO RECEBIDO.", body: "Estamos conferindo a confirmação do pagamento antes de preparar seu pedido." },
  pending: { title: "PAGAMENTO EM ANÁLISE.", body: "Quando o pagamento for confirmado, seu pedido seguirá para a J'aime." },
  failure: { title: "NÃO FOI POSSÍVEL CONCLUIR.", body: "Você pode tentar novamente sem perder suas escolhas." },
} as const;

type CheckoutReturnPageProps = { searchParams: Promise<{ status?: string | string[] }> };

export default async function CheckoutReturnPage({ searchParams }: CheckoutReturnPageProps) {
  const rawStatus = (await searchParams).status;
  const status = typeof rawStatus === "string" ? rawStatus : undefined;
  const message = status === "success" || status === "pending" || status === "failure" ? messages[status] : messages.pending;

  return <main className="checkout-page checkout-return"><section><p>J&apos;AIME</p><h1>{message.title}</h1><span>{message.body}</span><Link href={status === "failure" ? "/checkout" : "/crepes"}>{status === "failure" ? "TENTAR NOVAMENTE" : "VOLTAR AO CARDÁPIO"}</Link></section></main>;
}

