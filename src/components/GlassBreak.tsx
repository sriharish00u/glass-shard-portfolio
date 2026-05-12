import { useEffect, useMemo, useRef, useState } from "react";
import { useSound } from "@/hooks/useSound";

interface Shard {
  points: string;
  tx: number;
  ty: number;
  rot: number;
}

function genShards(variant: number, w = 1200, h = 120): Shard[] {
  let seed = variant * 9301 + 49297;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const cols = 6;
  const rows = 2;
  const shards: Shard[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = (c / cols) * w + (rnd() - 0.5) * 40;
      const y0 = (r / rows) * h + (rnd() - 0.5) * 20;
      const x1 = ((c + 1) / cols) * w + (rnd() - 0.5) * 40;
      const y1 = (r / rows) * h + (rnd() - 0.5) * 20;
      const x2 = ((c + 0.5) / cols) * w + (rnd() - 0.5) * 40;
      const y2 = ((r + 1) / rows) * h + (rnd() - 0.5) * 20;
      const x3 = ((c + 0.5) / cols) * w + (rnd() - 0.5) * 40;
      const y3 = ((r - 0.5 + 1) / rows) * h + (rnd() - 0.5) * 20;

      shards.push({
        points: `${x0},${y0} ${x1},${y1} ${x2},${y2}`,
        tx: (rnd() - 0.5) * 120,
        ty: (rnd() < 0.5 ? -1 : 1) * (40 + rnd() * 80),
        rot: (rnd() - 0.5) * 90,
      });
      shards.push({
        points: `${x0},${y0} ${x3},${y3} ${x2},${y2}`,
        tx: (rnd() - 0.5) * 120,
        ty: (rnd() < 0.5 ? -1 : 1) * (40 + rnd() * 80),
        rot: (rnd() - 0.5) * 90,
      });
    }
  }
  return shards;
}

export function GlassBreak({ variant = 0 }: { variant?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [broken, setBroken] = useState(false);
  const { playShatter } = useSound();
  const prevBroken = useRef(false);

  const shards = useMemo(() => genShards(variant), [variant]);

  useEffect(() => {
    if (broken && !prevBroken.current) playShatter();
    prevBroken.current = broken;
  }, [broken, playShatter]);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setBroken(e.isIntersecting);
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width: "100%", height: 120, overflow: "hidden" }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        width="100%"
        height="120"
        style={{ display: "block" }}
      >
        {shards.map((s, i) => (
          <polygon
            key={i}
            points={s.points}
            className={`shard ${broken ? "broken" : ""}`}
            style={
              {
                "--i": i,
                "--tx": `${s.tx}px`,
                "--ty": `${s.ty}px`,
                "--rot": `${s.rot}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
      <div
        className={`absolute left-0 right-0 top-1/2 h-px transition-opacity duration-700 ${broken ? "opacity-100" : "opacity-0"}`}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)",
        }}
      />
    </div>
  );
}
