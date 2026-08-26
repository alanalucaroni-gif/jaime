"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

type CrepesTransitionContextValue = {
  isTransitioning: boolean;
  goToCrepes: (href: string) => void;
};

const CrepesTransitionContext = createContext<CrepesTransitionContextValue | null>(null);
const WALK_DURATION = 7000;
const ROUTE_HANDOFF = 3400;

export function CrepesRouteTransitionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const pendingHrefRef = useRef<string | null>(null);
  const runningRef = useRef(false);
  const [mode, setMode] = useState<"idle" | "walk" | "fade">("idle");

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const stopCanvasRendering = useCallback(() => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const sizeCanvas = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return false;

    const maxWidth = window.matchMedia("(max-width: 900px)").matches ? 620 : 980;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return true;
  }, []);

  const drawVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !sizeCanvas()) return;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = frame.data;

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const greenDominance = green - Math.max(red, blue);

      if (green > 52 && greenDominance > 14) {
        const matte = Math.min(1, ((greenDominance - 14) / 58) * ((green - 42) / 96));
        pixels[index + 3] = Math.round(255 * (1 - matte));
        if (matte > .92) {
          pixels[index] = 0;
          pixels[index + 1] = 0;
          pixels[index + 2] = 0;
        }
      }
    }

    context.putImageData(frame, 0, 0);
  }, [sizeCanvas]);

  const startCanvasRendering = useCallback(() => {
    stopCanvasRendering();
    let lastFrameTime = 0;
    const render = (now: number) => {
      if (now - lastFrameTime >= 33) {
        drawVideoFrame();
        lastFrameTime = now;
      }
      if (!videoRef.current?.paused) frameRef.current = window.requestAnimationFrame(render);
    };
    frameRef.current = window.requestAnimationFrame(render);
  }, [drawVideoFrame, stopCanvasRendering]);

  const finish = useCallback(() => {
    clearTimers();
    stopCanvasRendering();
    pendingHrefRef.current = null;
    runningRef.current = false;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setMode("idle");
  }, [clearTimers, stopCanvasRendering]);

  const navigateNormally = useCallback((href: string) => {
    finish();
    window.location.assign(href);
  }, [finish]);

  const schedule = useCallback((callback: () => void, delay: number) => {
    timersRef.current.push(window.setTimeout(callback, delay));
  }, []);

  const handOffRoute = useCallback((href: string) => {
    router.push(href);
    schedule(() => {
      const destination = new URL(href, window.location.href);
      const currentLocation = `${window.location.pathname}${window.location.hash}`;
      const destinationLocation = `${destination.pathname}${destination.hash}`;
      if (currentLocation !== destinationLocation) window.location.assign(href);
    }, 320);
  }, [router, schedule]);

  const goToCrepes = useCallback((href: string) => {
    if (runningRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    runningRef.current = true;
    pendingHrefRef.current = href;

    if (prefersReducedMotion) {
      setMode("fade");
      schedule(() => window.location.assign(href), 160);
      return;
    }

    const video = videoRef.current;
    if (!video) {
      navigateNormally(href);
      return;
    }

    setMode("walk");
    try {
      video.currentTime = 0;
    } catch {
      navigateNormally(href);
      return;
    }

    void video.play().then(() => {
      if (!runningRef.current) return;
      startCanvasRendering();
      schedule(() => handOffRoute(href), ROUTE_HANDOFF);
      schedule(finish, WALK_DURATION);
    }).catch(() => navigateNormally(href));
  }, [finish, handOffRoute, navigateNormally, schedule, startCanvasRendering]);

  useEffect(() => {
    const video = videoRef.current;
    video?.load();
    return () => {
      clearTimers();
      stopCanvasRendering();
      video?.pause();
    };
  }, [clearTimers, stopCanvasRendering]);

  const handleVideoError = useCallback(() => {
    const href = pendingHrefRef.current;
    if (href) navigateNormally(href);
  }, [navigateNormally]);

  return <CrepesTransitionContext.Provider value={{ isTransitioning: mode !== "idle", goToCrepes }}>
    {children}
    <div className={`crepes-route-transition${mode !== "idle" ? " is-active" : ""}${mode === "walk" ? " is-walking" : ""}${mode === "fade" ? " is-fading" : ""}`} aria-hidden="true">
      <video ref={videoRef} className="crepes-route-transition__video" src="/images/jaime/senhor-jaime-walk.mp4" muted playsInline preload="auto" onLoadedData={sizeCanvas} onPlay={startCanvasRendering} onError={handleVideoError} />
      <canvas ref={canvasRef} className="crepes-route-transition__canvas" />
    </div>
  </CrepesTransitionContext.Provider>;
}

type CrepesRouteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function CrepesRouteLink({ href, onClick, target, ...props }: CrepesRouteLinkProps) {
  const transition = useContext(CrepesTransitionContext);

  return <a {...props} href={href} target={target} aria-disabled={transition?.isTransitioning || undefined} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || !transition || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || target === "_blank") return;
    event.preventDefault();
    transition.goToCrepes(href);
  }} />;
}

