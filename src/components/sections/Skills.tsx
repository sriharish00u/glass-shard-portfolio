import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { useSound } from "@/hooks/useSound";

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

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
    {children}
  </svg>
);

const SkillIcon = ({ name }: { name: string }) => {
  const icons: Record<string, ReactNode> = {
    "React Native": (
      <Svg>
        <circle cx="12" cy="12" r="3" fill="#61DAFB" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.2"
          transform="rotate(0 12 12)"
          fill="none"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.2"
          transform="rotate(60 12 12)"
          fill="none"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.2"
          transform="rotate(120 12 12)"
          fill="none"
        />
      </Svg>
    ),
    TypeScript: (
      <Svg>
        <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178C6" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          fontFamily="monospace"
        >
          TS
        </text>
      </Svg>
    ),
    "Node.js": (
      <Svg>
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#339933" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="bold"
          fontFamily="monospace"
        >
          N
        </text>
      </Svg>
    ),
    Express: (
      <Svg>
        <path d="M2 4h20L12 18 2 4z" fill="none" stroke="#F5F0E8" strokeWidth="1.5" />
        <path d="M12 18L2 4h20L12 18z" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
      </Svg>
    ),
    MongoDB: (
      <Svg>
        <ellipse cx="12" cy="14" rx="4" ry="7" fill="#47A248" />
        <path d="M12 2v5" stroke="#47A248" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    ),
    "Socket.IO": (
      <Svg>
        <circle cx="12" cy="12" r="9" stroke="#F5F0E8" strokeWidth="1.2" fill="none" />
        <path d="M8 16c3-5 5-2 8-7" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" />
      </Svg>
    ),
    Expo: (
      <Svg>
        <circle cx="12" cy="12" r="10" fill="#F5F0E8" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="#0A0A0A"
          fontSize="13"
          fontWeight="bold"
          fontFamily="monospace"
        >
          E
        </text>
      </Svg>
    ),
    Tailwind: (
      <Svg>
        <path
          d="M12 4C7 4 5 7 5 9c2 0 3.5-1 5-1 1.5 0 2.5 1 4 1 2.5 0 4-2 4-4 0 2 1.5 4 4 4 0-2-2-5-5-5-1.5 0-2.5 1-4 1s-2.5-1-4-1z"
          fill="#38BDF8"
        />
        <path
          d="M5 13c0 2 2 3 4 3 1.5 0 2.5-1 4-1 1.5 0 2.5 1 4 1 2.5 0 4-2 4-4 0 2 1.5 4 4 4 0-2-2-5-5-5-1.5 0-2.5 1-4 1s-2.5-1-4-1c-2.5 0-4 2-4 4z"
          fill="#38BDF8"
          opacity="0.5"
        />
      </Svg>
    ),
    Vite: (
      <Svg>
        <path d="M12 2L4 20h4l4-12 4 12h4L12 2z" fill="#A855F7" />
        <path d="M12 6l-2 6h4l-2 6" fill="#FBBF24" />
      </Svg>
    ),
    "Three.js": (
      <Svg>
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="#F5F0E8"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          3D
        </text>
      </Svg>
    ),
    Python: (
      <Svg>
        <path
          d="M9 4h6c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          fill="#3776AB"
        />
        <path d="M9 2h6c1.1 0 2 .9 2 2v1H7V4c0-1.1.9-2 2-2z" fill="#FFD43B" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          Py
        </text>
      </Svg>
    ),
    "HTML/CSS": (
      <Svg>
        <rect x="2" y="2" width="20" height="20" rx="2" fill="#E34F26" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          H
        </text>
      </Svg>
    ),
  };

  return icons[name] ?? <span className="text-[10px] font-bold">{name.slice(0, 2)}</span>;
};

export function Skills() {
  const [selected, setSelected] = useState<number | null>(null);
  const [angle, setAngle] = useState(0);
  const targetRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const sizeRef = useRef({ container: 480, radius: 220 });
  const { playPop, playDidic } = useSound();
  const didicThrottle = useRef(0);

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
        didicThrottle.current++;
        if (didicThrottle.current % 18 === 0) playDidic();
        if (Math.abs(diff) < 0.001) {
          angleRef.current = targetRef.current;
          targetRef.current = null;
          didicThrottle.current = 0;
        }
      } else {
        angleRef.current += 0.003;
        didicThrottle.current = 0;
      }
      setAngle(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = (i: number) => {
    setSelected(i);
    playPop();
    const desired = -Math.PI / 2 - (i * (Math.PI * 2)) / SKILLS.length;
    let target = desired;
    while (target - angleRef.current > Math.PI) target -= Math.PI * 2;
    while (target - angleRef.current < -Math.PI) target += Math.PI * 2;
    targetRef.current = target;
  };

  const topIndex = useMemo(() => {
    let minDist = Infinity;
    let best = 0;
    SKILLS.forEach((_, i) => {
      const a = angle + (i * (Math.PI * 2)) / SKILLS.length;
      let diff = (((a + Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      diff = Math.min(diff, Math.PI * 2 - diff);
      if (diff < minDist) {
        minDist = diff;
        best = i;
      }
    });
    return best;
  }, [angle]);

  const displaySkill = selected !== null ? selected : topIndex;

  const { container, radius } = sizeRef.current;
  const cx = container / 2;
  const cy = container / 2;

  return (
    <section data-section="skills" className="min-h-[80vh] flex flex-col items-center py-24 px-5">
      <div className="reveal w-full max-w-3xl">
        <SectionHeader number="03" title="Skills." align="center" />
      </div>

      <div
        className="reveal relative mt-16"
        style={{ width: container, height: container, "--i": 1 } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px dashed rgba(245,158,11,0.35)" }}
        />

        <div className="absolute inset-0 flex items-center justify-center text-center px-12">
          <div className="animate-[fadein_.3s_ease]">
            <div
              className="font-serif text-[#F5F0E8]"
              style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
            >
              {SKILLS[displaySkill]}
            </div>
            <div className="mx-auto mt-2 h-[2px] w-10 bg-[#F59E0B]" />
          </div>
        </div>

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
              className="absolute flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                left: x,
                top: y,
                width: 48,
                height: 48,
                transform: "translate(-50%, -50%)",
                background: isSel ? "#F59E0B" : "#0A0A0A",
                border: `1.5px solid ${isSel ? "#F59E0B" : "rgba(245,158,11,0.5)"}`,
                boxShadow: isSel ? "0 0 24px rgba(245,158,11,0.5)" : "none",
              }}
              aria-label={s}
              title={s}
            >
              <SkillIcon name={s} />
            </button>
          );
        })}
      </div>

      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}
