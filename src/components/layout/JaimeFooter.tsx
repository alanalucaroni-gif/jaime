import Image from "next/image";
import { brand } from "@/config/brand";

export function JaimeFooter() {
  return <footer className="footer"><div className="shell footer-top"><div><Image src="/images/jaime/logo.png" alt="Jaime Creperia" width={190} height={100} /><h2>MASSA FININHA.<span>RECHEIO GENEROSO.</span></h2></div><nav><a href="#sabores">Sabores</a><a href="#atelier">Monte o seu</a><a href={brand.orderUrl}>Abrir cardápio ↗</a></nav></div><div className="shell copyright"><span>© {new Date().getFullYear()} Jaime Creperia</span><span>Uma obra em cada crepe.</span></div><div className="footer-word">JAIME</div></footer>;
}
