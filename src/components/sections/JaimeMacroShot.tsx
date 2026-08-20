"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

const CREPE = "/images/jaime/hero-full-cone-transparent-v4.png";
/* Ganache pooling on the crepe face, right under the piped swirls. */
const POOL = "M462 400C498 356 542 342 604 342L996 344L996 418C982 464 950 494 930 446C914 404 878 420 864 474C850 526 812 516 800 458C788 404 752 418 740 476C728 530 694 520 684 456C674 402 638 416 626 468C614 516 580 508 572 454C564 408 528 422 512 460C498 492 470 472 462 428Z";
/* The spill lip where the sauce goes over the folded edge of the crepe. */
const SPILL = "M880 366C934 362 978 388 984 424C990 458 970 486 944 484C922 482 910 462 912 436C914 410 902 388 872 384Z";
/* One continuous ribbon: folded edge down to the tip of the cone. */
const RIBBON = "M940 396C978 424 980 462 952 492C930 514 892 512 870 536C830 624 788 710 748 800C718 866 686 934 657 1000C630 1070 606 1140 588 1206";

export function JaimeMacroShot() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ribbon = ref.current!.querySelector<SVGPathElement>("#macroRibbon")!;
    const len = ribbon.getTotalLength();
    gsap.set("[data-macro-drop] ellipse, [data-macro-tip], [data-macro-spill]", { opacity: 0 });

    /* Locked-off camera: nothing moves but the cream and the sauce. */
    const loop = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    loop.fromTo("[data-macro-spec]", { strokeDashoffset: 150 }, { strokeDashoffset: -len, duration: 3.5, repeat: -1 }, 0)
      .to("[data-macro-sheen]", { attr: { cx: 930 }, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0)
      .to("[data-macro-tip]", { keyframes: [{ opacity: 0, y: 0, scaleY: .55, duration: 0 }, { opacity: 1, scaleY: 1.1, duration: 1.1, ease: "power1.out" }, { y: 130, scaleY: 2.6, duration: 1.5, ease: "power2.in" }, { opacity: 0, duration: .3 }], duration: 2.9, repeat: -1, repeatDelay: 1.2 }, 1.4);

    [0, 1, 2].forEach((i) => {
      const at = i * 2.3;
      loop.to(`[data-macro-drop='${i}']`, { duration: 3.45, repeat: -1, repeatDelay: 3.45, ease: "power1.in", motionPath: { path: RIBBON, start: .26 + i * .05, end: .99 } }, at)
        .to(`[data-macro-drop='${i}'] ellipse`, { keyframes: [{ opacity: 0, scaleY: .6, duration: 0 }, { opacity: .95, scaleY: 1, duration: .5, ease: "power2.out" }, { scaleY: 2.2, duration: 2.55, ease: "power2.in" }, { opacity: 0, duration: .4 }], duration: 3.45, repeat: -1, repeatDelay: 3.45 }, at);
    });

    /* Slow continuous collapse of the piped cream while the sauce builds up. */
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 72%", once: true }, onComplete: () => loop.play() })
      .to("[data-macro-cream]", { yPercent: 1, scaleY: .93, skewX: 2, rotate: .4, duration: 3.6, ease: "power1.inOut" }, 0)
      .fromTo("[data-melt-disp]", { attr: { scale: 0 } }, { attr: { scale: 6 }, duration: 3.6, ease: "power1.inOut" }, 0)
      .fromTo("[data-melt-blur]", { attr: { stdDeviation: 0 } }, { attr: { stdDeviation: .8 }, duration: 3.6, ease: "power1.inOut" }, 0)
      .from("[data-macro-pool]", { attr: { height: 0 }, duration: 2.4, ease: "power2.out" }, .3)
      .to("[data-macro-spill]", { opacity: 1, duration: .8 }, 1.3)
      .fromTo("[data-macro-flow]", { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.8, ease: "power1.inOut" }, 1.1);
  }, { scope: ref });

  return <section ref={ref} className="macro-shot">
    <div className="macro-stage">
      <div className="macro-crepe"><Image src={CREPE} alt="Crepe da Jaime em macro, com creme de chocolate derretendo e calda escorrendo até a ponta do cone" fill sizes="(max-width: 900px) 98vw, 1180px" /></div>

      <svg className="macro-layer" viewBox="0 0 1254 1254" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="macroGanache" x1="0" y1="336" x2="0" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a4551f" /><stop offset=".45" stopColor="#6d2c10" /><stop offset="1" stopColor="#3a1707" />
          </linearGradient>
          <radialGradient id="macroSheen">
            <stop offset="0" stopColor="#ffdcae" stopOpacity=".75" /><stop offset="1" stopColor="#ffdcae" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="macroPoolFade" x1="0" y1="336" x2="0" y2="382" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" /><stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id="macroPoolMask"><rect x="0" y="0" width="1254" height="1254" fill="url(#macroPoolFade)" /></mask>
          <clipPath id="macroPoolClip"><rect data-macro-pool x="430" y="330" width="600" height="215" /></clipPath>
        </defs>
        <g clipPath="url(#macroPoolClip)" mask="url(#macroPoolMask)">
          <path d={POOL} fill="url(#macroGanache)" />
          <ellipse cx="740" cy="368" rx="260" ry="14" fill="url(#macroSheen)" opacity=".4" />
          <ellipse data-macro-sheen cx="560" cy="376" rx="170" ry="12" fill="url(#macroSheen)" />
        </g>
      </svg>

      <div data-macro-cream className="macro-cream" aria-hidden="true"><Image src={CREPE} alt="" fill sizes="(max-width: 900px) 98vw, 1180px" /></div>

      <svg className="macro-layer macro-sauce" viewBox="0 0 1254 1254" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id="macroMelt" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.014" numOctaves="2" seed="7" result="melt" />
            <feDisplacementMap data-melt-disp in="SourceGraphic" in2="melt" scale="0" xChannelSelector="R" yChannelSelector="G" result="slump" />
            <feGaussianBlur data-melt-blur in="slump" stdDeviation="0" />
          </filter>
          <radialGradient id="macroBead" cx=".35" cy=".3" r=".85">
            <stop offset="0" stopColor="#8b4620" /><stop offset=".55" stopColor="#4a1d0a" /><stop offset="1" stopColor="#240d04" />
          </radialGradient>
          <linearGradient id="macroFlow" x1="940" y1="396" x2="588" y2="1206" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7c3a17" /><stop offset=".5" stopColor="#4a1d0a" /><stop offset="1" stopColor="#2a0f05" />
          </linearGradient>
        </defs>
        <path data-macro-spill d={SPILL} fill="url(#macroFlow)" />
        <path data-macro-flow d={RIBBON} fill="none" stroke="#260d04" strokeWidth="36" strokeLinecap="round" opacity=".9" />
        <path id="macroRibbon" data-macro-flow d={RIBBON} fill="none" stroke="url(#macroFlow)" strokeWidth="28" strokeLinecap="round" />
        <path data-macro-flow d={RIBBON} fill="none" stroke="#c4763b" strokeWidth="8" strokeLinecap="round" opacity=".5" transform="translate(-8 0)" />
        <path data-macro-spec d={RIBBON} fill="none" stroke="#fff2dd" strokeWidth="6" strokeLinecap="round" opacity=".85" strokeDasharray="140 4000" transform="translate(-8 0)" style={{ mixBlendMode: "screen" }} />
        {[0, 1, 2].map((i) => <g data-macro-drop={i} key={i}><ellipse cx="0" cy="0" rx="24" ry="30" fill="url(#macroBead)" opacity="0" /></g>)}
        <ellipse data-macro-tip cx="588" cy="1212" rx="21" ry="27" fill="url(#macroBead)" opacity="0" />
      </svg>
    </div>
  </section>;
}
