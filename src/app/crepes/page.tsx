import type { Metadata } from "next";
import { CrepesShop } from "@/components/shop/CrepesShop";

export const metadata: Metadata = {
  title: "Peça seu crepe | J'aime Creperia",
  description: "Escolha entre crepes salgados, doces ou monte sua própria obra J'aime.",
};

export default function CrepesPage() {
  return <CrepesShop />;
}
