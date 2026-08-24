# Ativação do ERP J'aime

## 1. Criar a base

1. Entre em [database.new](https://database.new) e crie um projeto Supabase.
2. No painel do projeto, abra **SQL Editor**.
3. Copie e execute o conteúdo de `supabase/migrations/20260824_jaime_erp.sql`.

Essa etapa cria os pedidos, itens, produtos, clientes, histórico de status, estoque e perfis da equipe. Os pedidos são criados de forma transacional, para não deixar um pedido sem seus itens.

## 2. Criar o primeiro acesso

1. Abra **Authentication → Users → Add user** e crie seu usuário com e-mail e senha.
2. Volte ao **SQL Editor** e execute, substituindo o e-mail:

```sql
update public.profiles
set role = 'owner'
where email = 'seu-email@exemplo.com';
```

Não habilite cadastro público no aplicativo. Os próximos acessos da equipe devem ser criados por uma pessoa proprietária/gerente.

## 3. Configurar as variáveis

No Supabase, abra **Connect** e copie a URL do projeto, a Publishable Key e a Secret Key. Cadastre no ambiente local e no Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` é sigilosa: só pode existir no servidor/Vercel. Nunca a envie pelo chat, nem a coloque em uma variável `NEXT_PUBLIC_`.

## 4. Ligar pedido e pagamento

Com as variáveis do Supabase e Mercado Pago configuradas, o checkout registra o pedido inicialmente como `draft`, muda para `awaiting_payment` ao criar a preferência e atualiza o ERP pelo webhook após o retorno do Mercado Pago.

O painel fica em `/gestao`. Em desenvolvimento, sem variáveis do Supabase, ele mostra um modo demonstrativo identificado — nenhum dado é salvo.

