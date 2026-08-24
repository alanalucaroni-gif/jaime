-- J'aime ERP: execute this migration in the Supabase SQL Editor before adding credentials.
create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('owner', 'manager', 'kitchen', 'delivery');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.order_status as enum ('draft', 'awaiting_payment', 'received', 'in_preparation', 'ready', 'out_for_delivery', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.payment_status as enum ('pending', 'approved', 'failed', 'refunded');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.fulfillment_method as enum ('pickup', 'delivery');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role public.user_role not null default 'kitchen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  available boolean not null default true,
  preparation_minutes integer check (preparation_minutes is null or preparation_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id uuid references public.customers(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  fulfillment public.fulfillment_method not null,
  delivery_address jsonb not null default '{}'::jsonb,
  status public.order_status not null default 'draft',
  payment_status public.payment_status not null default 'pending',
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  mercado_pago_preference_id text unique,
  mercado_pago_payment_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  title text not null,
  description text not null default '',
  modifiers jsonb not null default '[]'::jsonb,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit text not null,
  current_quantity numeric(12,3) not null default 0,
  minimum_quantity numeric(12,3) not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.inventory_items enable row level security;

create policy "staff manages profiles" on public.profiles for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages customers" on public.customers for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages orders" on public.orders for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages order items" on public.order_items for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages order history" on public.order_status_history for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manages inventory" on public.inventory_items for all using (public.is_staff()) with check (public.is_staff());

create or replace function public.create_order_with_items(p_order jsonb, p_items jsonb)
returns public.orders language plpgsql security definer set search_path = public as $$
declare
  created_order public.orders%rowtype;
  customer_uuid uuid;
  item jsonb;
begin
  insert into public.customers (name, email, phone)
  values (p_order->>'customer_name', p_order->>'customer_email', p_order->>'customer_phone')
  on conflict (email) do update set name = excluded.name, phone = excluded.phone
  returning id into customer_uuid;

  insert into public.orders (
    customer_id, customer_name, customer_email, customer_phone, fulfillment,
    delivery_address, subtotal, total
  ) values (
    customer_uuid, p_order->>'customer_name', p_order->>'customer_email', p_order->>'customer_phone',
    (p_order->>'fulfillment_method')::public.fulfillment_method,
    coalesce(p_order->'delivery_address', '{}'::jsonb),
    (p_order->>'subtotal')::numeric, (p_order->>'total')::numeric
  ) returning * into created_order;

  for item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    insert into public.order_items (order_id, product_id, title, description, modifiers, quantity, unit_price)
    values (
      created_order.id, item->>'product_id', item->>'title', coalesce(item->>'description', ''),
      coalesce(item->'modifiers', '[]'::jsonb), (item->>'quantity')::integer, (item->>'unit_price')::numeric
    );
  end loop;

  insert into public.order_status_history (order_id, status, note)
  values (created_order.id, 'draft', 'Pedido criado pelo checkout.');
  return created_order;
end; $$;

create or replace function public.update_order_status(
  p_order_id uuid,
  p_status public.order_status,
  p_note text default null,
  p_payment_status public.payment_status default null,
  p_payment_id text default null,
  p_preference_id text default null
) returns public.orders language plpgsql security definer set search_path = public as $$
declare updated_order public.orders%rowtype;
begin
  update public.orders
  set status = p_status,
      payment_status = coalesce(p_payment_status, payment_status),
      mercado_pago_payment_id = coalesce(p_payment_id, mercado_pago_payment_id),
      mercado_pago_preference_id = coalesce(p_preference_id, mercado_pago_preference_id)
  where id = p_order_id
  returning * into updated_order;

  if not found then raise exception 'Pedido não encontrado'; end if;
  insert into public.order_status_history (order_id, status, note)
  values (updated_order.id, p_status, p_note);
  return updated_order;
end; $$;

revoke all on function public.create_order_with_items(jsonb, jsonb) from public;
revoke all on function public.update_order_status(uuid, public.order_status, text, public.payment_status, text, text) from public;
grant execute on function public.create_order_with_items(jsonb, jsonb) to service_role;
grant execute on function public.update_order_status(uuid, public.order_status, text, public.payment_status, text, text) to service_role;

