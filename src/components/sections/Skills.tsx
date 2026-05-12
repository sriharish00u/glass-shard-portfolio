import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";

const SKILLS = [
  "React Native",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Socket.IO",
  "Expo",
  "Tailwind",
  "Vite",
  "Three.js",
  "Python",
  "HTML/CSS",
];

// Short label / monogram for each skill (inline SVG-free for simplicity)
const GLYPHS: Record<string, string> = {
  "React Native": "RN",
  TypeScript: "TS",
  "Node.js": "JS",
  Express: "EX",
  MongoDB: "M",
  "Socket.IO": "IO",
  Expo: "EX",
  Tailwind: "TW",
  Vite: "V",
  "Three.js": "3D",
  Python: "Py",
  "HTML/CSS": "<>",
};

export function Skills() {
  const [selected, setSelected] = useState<number | null>(null);
  const [angle, setAngle] = useState(0);
  const targetRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const sizeRef = useRef({ container: 480, radius: 220 });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) sizeRef.current = { container: 320, radius: 140 };
      else sizeRef.current = { container: 480, radius: 220 };
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (targetRef.current !== null) {
        const diff = targetRef.current - angleRef.current;
        angleRef.current += diff * 0.1;
        if (Math.abs(diff) < 0.001) {
          angleRef.current = targetRef.current;
          targetRef.current = null;
        }
      } else {
        angleRef.current += 0.003;
      }
      setAngle(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = (i: number) => {
    setSelected(i);
    const itemAngle = angleRef.current + (i * (Math.PI * 2)) / SKILLS.length;
    // Want itemAngle to equal -π/2 mod 2π
    const desired = -Math.PI / 2 - (i * (Math.PI * 2)) / SKILLS.length;
    // Pick shortest arc near current angleRef
    let target = desired;
    while (target - angleRef.current > Math.PI) target -= Math.PI * 2;
    while (target - angleRef.current < -Math.PI) target += Math.PI * 2;
    targetRef.current = target;
    void itemAngle;
  };

  const { container, radius } = sizeRef.current;
  const cx = container / 2;
  const cy = container / 2;

  return (
    <section
      data-section="skills"
      className="min-h-[80vh] flex flex-col items-center py-24 px-5"
    >
      <div className="reveal w-full max-w-3xl">
        <SectionHeader number="03" title="Skills." align="center" />
      </div>

      <div
        className="reveal relative mt-16"
        style={{ width: container, height: container, "--i": 1 } as React.CSSProperties}
      >
        {/* Orbit ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px dashed rgba(245,158,11,0.35)" }}
        />

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-12">
          {selected !== null ? (
            <div className="animate-[fadein_.3s_ease]">
              <div
                className="font-serif text-[#F5F0E8]"
                style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
              >
                {SKILLS[selected]}
              </div>
              <div className="mx-auto mt-2 h-[2px] w-10 bg-[#F59E0B]" />
            </div>
          ) : (
            <div className="text-[#F5F0E8]/40 text-sm tracking-wide">
              Select a skill
            </div>
          )}
        </div>

        {/* Icons */}
        {SKILLS.map((s, i) => {
          const a = angle + (i * (Math.PI * 2)) / SKILLS.length;
          const x = cx + radius * Math.cos(a);
          const y = cy + radius * Math.sin(a);
          const isSel = selected === i;
          return (
            <button
              key={s}
              onClick={() => handleClick(i)}
              data-hover
              className="absolute flex items-center justify-center rounded-full transition-colors"
              style={{
                left: x,
                top: y,
                width: 48,
                height: 48,
                transform: "translate(-50%, -50%)",
                background: isSel ? "#F59E0B" : "#0A0A0A",
                border: `1.5px solid ${isSel ? "#F59E0B" : "rgba(245,158,11,0.5)"}`,
                color: isSel ? "#0A0A0A" : "#F5F0E8",
                fontFamily: "DM Serif Display, serif",
                fontSize: 14,
                boxShadow: isSel ? "0 0 24px rgba(245,158,11,0.5)" : "none",
              }}
              aria-label={s}
              title={s}
            >
              {GLYPHS[s]}
            </button>
          );
        })}
      </div>

      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}
