type SupabaseRequest = Omit<RequestInit, "headers"> & { headers?: HeadersInit };

function baseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
}

export function hasSupabasePublicConfig() {
  return Boolean(baseUrl() && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function hasSupabaseAdminConfig() {
  return Boolean(baseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function supabaseAdmin<T>(path: string, init: SupabaseRequest = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl() || !key) throw new Error("O ERP ainda não está conectado ao Supabase.");

  const response = await fetch(`${baseUrl()}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Não foi possível comunicar com a base do ERP.");
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function supabaseAuth<T>(path: string, init: SupabaseRequest = {}) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl() || !key) throw new Error("O ERP ainda não está conectado ao Supabase.");

  const response = await fetch(`${baseUrl()}/auth/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("E-mail ou senha não conferem.");
  return response.json() as Promise<T>;
}

