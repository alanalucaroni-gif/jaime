import { redirect } from "next/navigation";
import { ManagementConsole } from "@/components/management/ManagementConsole";
import { getErpSession } from "@/lib/erp/auth";
import { hasSupabaseAdminConfig, hasSupabasePublicConfig } from "@/lib/erp/supabase";

export const metadata = { title: "Gestão | J'aime Creperia", robots: { index: false, follow: false } };

export default async function ManagementPage() {
  const configured = hasSupabasePublicConfig() && hasSupabaseAdminConfig();
  if (!configured && process.env.NODE_ENV === "development") return <ManagementConsole demo />;
  if (!configured) redirect("/gestao/login");

  const profile = await getErpSession();
  if (!profile) redirect("/gestao/login");
  return <ManagementConsole profile={profile} />;
}

