"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sessionStorage.getItem("jaime-loaded")) { ref.current?.remove(); return; }
    document.body.style.overflow = "hidden";
    const counter = { value: 0 };
    const tl = gsap.timeline({ onComplete: () => { sessionStorage.setItem("jaime-loaded", "1"); document.body.style.overflow = ""; ref.current?.remove(); } });
    tl.to(counter, { value: 100, duration: 1.5, ease: "power3.inOut", onUpdate: () => { const node = ref.current?.querySelector("[data-count]"); if (node) node.textContent = `${Math.round(counter.value)}`; } })
      .to("[data-loader-line]", { scaleX: 1, duration: 1.5, ease: "power3.inOut" }, 0)
      .to("[data-loader-word]", { yPercent: -120, stagger: .05, duration: .6, ease: "power4.in" })
      .to(ref.current, { yPercent: -100, duration: .85, ease: "power4.inOut" }, "-=.15");
    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, []);
  return <div ref={ref} className="preloader"><div className="loader-brand"><span data-loader-word>J</span><span data-loader-word>A</span><span data-loader-word>I</span><span data-loader-word>M</span><span data-loader-word>E</span></div><div className="loader-meta"><span>Preparando sua obra...</span><b data-count>0</b></div><div className="loader-track"><i data-loader-line /></div></div>;
}
