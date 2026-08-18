"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";

export function MagneticLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (event.clientX - box.left - box.width / 2) * 0.2,
      y: (event.clientY - box.top - box.height / 2) * 0.2,
      duration: 0.35,
      ease: "power3.out",
    });
  };
  return (
    <a ref={ref} href={href} onPointerMove={move} onPointerLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" })} className={className}>
      {children}
    </a>
  );
}
