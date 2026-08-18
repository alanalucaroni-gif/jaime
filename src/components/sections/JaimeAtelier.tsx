import { brand } from "@/config/brand";

const steps = [
  ["01", "Escolha a massa", "Tradicional, baunilha ou chocolate."],
  ["02", "Crie o recheio", "Combine os ingredientes que mais gosta."],
  ["03", "Finalize a obra", "Molhos, texturas e o toque final."],
];

export function JaimeAtelier() {
  return <section id="atelier" className="atelier"><div className="shell"><p className="eyebrow">L’atelier de Jaime</p><h2>VOCÊ IMAGINA.<span>JAIME CRIA.</span></h2>
    <div className="steps">{steps.map(([n, title, text]) => <article key={n}><b>{n}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
    <div className="atelier-cta"><p>Pronto para criar seu chef-d’œuvre?</p><a href={brand.orderUrl}>Montar meu crepe ↗</a></div>
  </div></section>;
}
