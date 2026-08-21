"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sessionStorage.getItem("jaime-loaded-v3")) { ref.current?.remove(); return; }
    document.body.style.overflow = "hidden";
    const counter = { value: 0 };
    const layers = ref.current?.querySelectorAll("[data-crepe-layer]");
    const tl = gsap.timeline({ onComplete: () => { sessionStorage.setItem("jaime-loaded-v3", "1"); document.body.style.overflow = ""; ref.current?.remove(); } });
    tl.set(layers ?? [], { opacity: 0 })
      .fromTo("[data-crepe-layer='wrapper']", { y: 170, scale: .72 }, { y: 0, scale: 1, opacity: 1, duration: .65, ease: "back.out(1.5)" })
      .fromTo("[data-crepe-layer='dough']", { y: -190, rotate: -9, scale: .75 }, { y: 0, rotate: 0, scale: 1, opacity: 1, duration: .52, ease: "back.out(1.7)" }, "-=.2")
      .fromTo("[data-crepe-layer='cream']", { y: -170, scaleX: .65 }, { y: 0, scaleX: 1, opacity: 1, duration: .42, ease: "back.out(1.8)" }, "-=.17")
      .fromTo("[data-crepe-layer='chocolate']", { y: -150, scaleX: .7 }, { y: 0, scaleX: 1, opacity: 1, duration: .4, ease: "back.out(1.8)" }, "-=.16")
      .fromTo("[data-crepe-layer='fruit']", { y: -210, rotate: -12, scale: .4 }, { y: 0, rotate: 0, scale: 1, opacity: 1, duration: .48, ease: "back.out(2)", stagger: .06 }, "-=.18")
      .fromTo("[data-loader-caption]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .35 }, "-=.15")
      .to("[data-loader-assembly]", { scale: 1.06, y: -8, duration: .32, ease: "power2.inOut" })
      .to("[data-loader-assembly]", { scale: .82, opacity: 0, duration: .42, ease: "power3.in" }, "+=.18")
      .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: .78, ease: "power4.inOut" }, "-=.12");
    tl.to(counter, { value: 100, duration: tl.duration() - .55, ease: "none", onUpdate: () => { const node = ref.current?.querySelector("[data-count]"); if (node) node.textContent = `${Math.round(counter.value)}`; } }, 0);
    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, []);
  return <div ref={ref} className="preloader layer-loader">
    <div data-loader-assembly className="loader-assembly" aria-label="Montando um crepe J'aime">
      <div className="loader-logo"><Image src="/images/jaime/logo.png" alt="J'aime" width={138} height={76} priority /></div>
      <div className="loader-crepe">
        <div data-crepe-layer="fruit" className="loader-fruit loader-fruit-a"><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" fill sizes="80px" /></div>
        <div data-crepe-layer="fruit" className="loader-fruit loader-fruit-b"><Image src="/images/jaime/strawberry-transparent-v1.png" alt="" fill sizes="80px" /></div>
        <div data-crepe-layer="fruit" className="loader-fruit loader-fruit-c"><Image src="/images/jaime/cookie-transparent-v1.png" alt="" fill sizes="80px" /></div>
        <div data-crepe-layer="chocolate" className="loader-food-layer loader-chocolate" />
        <div data-crepe-layer="cream" className="loader-food-layer loader-cream" />
        <div data-crepe-layer="dough" className="loader-dough">CRÊPE</div>
        <div data-crepe-layer="wrapper" className="loader-wrapper"><span>J&apos;AIME</span></div>
      </div>
      <div data-loader-caption className="loader-caption"><span>PREPARANDO SUA OBRA...</span><b><span data-count>0</span>%</b></div>
    </div>
  </div>;
}
