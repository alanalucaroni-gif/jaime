import type { Metadata } from "next";
import { CrepesShop } from "@/components/shop/CrepesShop";

export const metadata: Metadata = {
  title: "Crepes | J'aime Creperia",
  description: "Conheça as obras doces e salgadas da J'aime Creperia.",
};

export default function CrepesPage() {
  return <CrepesShop />;
}
