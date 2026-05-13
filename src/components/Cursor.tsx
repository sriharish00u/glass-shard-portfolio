import { useEffect, useRef } from "react";
import { useSound } from "@/hooks/useSound";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const { playCursorHover } = useSound();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let dotX = window.innerWidth / 2;
    let dotY = window.innerHeight / 2;
    let trailX = dotX;
    let trailY = dotY;
    let raf = 0;
    let hoverThrottle = 0;

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }
    };

    const tick = () => {
      trailX += (dotX - trailX) * 0.18;
      trailY += (dotY - trailY) * 0.18;
      if (trailRef.current) {
        trailRef.current.style.left = `${trailX}px`;
        trailRef.current.style.top = `${trailY}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const enter = () => {
      trailRef.current?.classList.add("hover");
      const now = Date.now();
      if (now - hoverThrottle > 200) {
        hoverThrottle = now;
        playCursorHover();
      }
    };
    const leave = () => trailRef.current?.classList.remove("hover");

    const targets = document.querySelectorAll("a, button, input, textarea, [data-hover]");
    targets.forEach((t) => {
      t.addEventListener("mouseenter", enter);
      t.addEventListener("mouseleave", leave);
    });

    window.addEventListener("mousemove", onMove);

    // Re-bind on DOM mutations (sections mount async)
    const mo = new MutationObserver(() => {
      document.querySelectorAll("a, button, input, textarea, [data-hover]").forEach((t) => {
        t.removeEventListener("mouseenter", enter);
        t.removeEventListener("mouseleave", leave);
        t.addEventListener("mouseenter", enter);
        t.addEventListener("mouseleave", leave);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#F5F0E8",
          pointerEvents: "none",
          zIndex: 10000,
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={trailRef}
        className="cursor-trail"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          marginLeft: -14,
          marginTop: -14,
          borderRadius: "50%",
          background: "#3B82F6",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          transition: "transform 0.18s ease, opacity 0.2s ease, background 0.2s ease",
        }}
      />
      <style>{`
        .cursor-trail.hover { transform: scale(2.2); opacity: 0.5; }
        @media (pointer: coarse) { .cursor-trail, ${""} div[style*="z-index: 10000"] { display: none !important; } }
      `}</style>
    </>
  );
}
