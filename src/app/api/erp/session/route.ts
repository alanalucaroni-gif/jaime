import { cookies } from "next/headers";
import { ERP_SESSION_COOKIE, getErpProfile, signInErp } from "@/lib/erp/auth";
import { hasSupabaseAdminConfig, hasSupabasePublicConfig } from "@/lib/erp/supabase";

export async function POST(request: Request) {
  if (!hasSupabasePublicConfig() || !hasSupabaseAdminConfig()) {
    return Response.json({ error: "O ERP ainda não foi conectado ao Supabase." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return Response.json({ error: "Informe e-mail e senha." }, { status: 400 });

  try {
    const session = await signInErp(email, password);
    const profile = await getErpProfile(session.user.id);
    if (!profile) return Response.json({ error: "Este usuário não tem acesso ao ERP." }, { status: 403 });

    (await cookies()).set(ERP_SESSION_COOKIE, session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: session.expires_in,
    });
    return Response.json({ profile });
  } catch {
    return Response.json({ error: "E-mail, senha ou acesso ao ERP não conferem." }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete(ERP_SESSION_COOKIE);
  return Response.json({ signedOut: true });
}

