import { cookies } from "next/headers";
import { hasSupabaseAdminConfig, hasSupabasePublicConfig, supabaseAdmin, supabaseAuth } from "@/lib/erp/supabase";

export const ERP_SESSION_COOKIE = "jaime_erp_session";

type AuthResponse = { access_token: string; expires_in: number; user: { id: string; email?: string } };
export type ErpProfile = { id: string; email: string; display_name: string | null; role: "owner" | "manager" | "kitchen" | "delivery" };

export async function signInErp(email: string, password: string) {
  return supabaseAuth<AuthResponse>("token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getErpProfile(userId: string) {
  if (!hasSupabaseAdminConfig()) return null;
  const profiles = await supabaseAdmin<ErpProfile[]>(`profiles?id=eq.${encodeURIComponent(userId)}&select=id,email,display_name,role`);
  return profiles[0] ?? null;
}

export async function getErpSession() {
  if (!hasSupabasePublicConfig() || !hasSupabaseAdminConfig()) return null;
  const token = (await cookies()).get(ERP_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const user = await supabaseAuth<{ id: string }>("user", { headers: { Authorization: `Bearer ${token}` } });
    return getErpProfile(user.id);
  } catch {
    return null;
  }
}

