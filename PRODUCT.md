# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clientes da J'aime Creperia que escolhem crepes doces ou salgados pelo celular ou computador e querem concluir um pedido de entrega ou retirada; e a equipe interna, que controla operação, cozinha, cardápio e entrega pelo ERP.

## Product Purpose

Permitir que a J'aime receba pedidos e pagamentos diretamente pelo próprio site, sem depender do cardápio ou checkout da Deeliv.

O ERP interno concentra o estado operacional do pedido, mantendo histórico e permissões por função.

## Positioning

Uma experiência de pedido autoral: o cliente escolhe a obra, personaliza o crepe e conclui o pagamento no universo da J'aime.

## Operating Context

O cliente navega pelo cardápio, seleciona produtos ou monta um crepe, escolhe entre entrega e retirada e conclui o pagamento. A operação recebe o pedido confirmado após o pagamento.

## Capabilities and Constraints

- Deve oferecer retirada e entrega.
- O Mercado Pago será usado inicialmente em ambiente de teste com uma conta pessoal da proprietária.
- Taxa, raio e prazo de entrega ainda não foram definidos e não devem ser cobrados até confirmação posterior.
- Credenciais de pagamento devem permanecer apenas em variáveis de ambiente do Vercel, nunca no código ou no navegador.
- O ERP usará Supabase (Postgres + Auth). Funções administrativas exigem sessão de equipe e não podem ficar públicas.

## Brand Commitments

J'aime Creperia usa linguagem em português e uma identidade francesa autoral, com a mensagem "Uma obra em cada crepe." Os cards atuais do cardápio devem ser preservados.

## Evidence on Hand

- Cardápio e fluxo de personalização em `src/components/shop/CrepesShop.tsx`.
- Identidade, imagens e estilos existentes em `src/app/globals.css` e `public/images/jaime/`.

## Product Principles

- A escolha do cliente deve permanecer clara até o pagamento.
- O total mostrado deve ser validado no servidor antes de criar uma cobrança.
- O checkout deve funcionar bem em telas pequenas e não exigir que o cliente repita escolhas.
- Pagamentos e dados sensíveis devem ser delegados ao provedor certificado.

## Accessibility & Inclusion

O checkout deve ter rótulos explícitos, navegação por teclado, mensagens de erro próximas aos campos e suporte a redução de movimento.

