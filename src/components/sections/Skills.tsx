import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { useSound } from "@/hooks/useSound";

const SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "Java",
  "SQL",
  "React Basics",
  "Node.js Basics",
  "Git & GitHub",
  "UI Design",
  "Problem Solving",
  "AI-assisted Development",
];

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
    {children}
  </svg>
);

const SkillIcon = ({ name }: { name: string }) => {
  const icons: Record<string, ReactNode> = {
    HTML: (
      <Svg>
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#E44D26" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          H
        </text>
      </Svg>
    ),
    CSS: (
      <Svg>
        <path d="M12 2C12 2 4 10 4 15c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-8-13-8-13z" fill="#2965F1" />
      </Svg>
    ),
    JavaScript: (
      <Svg>
        <rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="#000"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          JS
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
    Java: (
      <Svg>
        <path d="M5 3h14v9c0 3.3-2.2 6-5.5 6h-3C7.2 18 5 15.3 5 12V3z" fill="#ED1D25" />
        <path
          d="M17 6h2c1.7 0 3 1.1 3 3s-1.3 3-3 3h-2"
          fill="none"
          stroke="#ED1D25"
          strokeWidth="1.2"
        />
        <text
          x="10"
          y="15"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          J
        </text>
      </Svg>
    ),
    SQL: (
      <Svg>
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="#A0A0A0" />
        <path
          d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"
          fill="none"
          stroke="#A0A0A0"
          strokeWidth="1.2"
        />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="#A0A0A0" strokeWidth="1.2" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="#A0A0A0"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          S
        </text>
      </Svg>
    ),
    "React Basics": (
      <Svg>
        <circle cx="12" cy="12" r="3" fill="#61DAFB" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.2"
          fill="none"
          transform="rotate(0 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.2"
          fill="none"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="#61DAFB"
          strokeWidth="1.2"
          fill="none"
          transform="rotate(120 12 12)"
        />
      </Svg>
    ),
    "Node.js Basics": (
      <Svg>
        <polygon points="12,3 21,8 21,16 12,21 3,16 3,8" fill="#339933" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
        >
          N
        </text>
      </Svg>
    ),
    "Git & GitHub": (
      <Svg>
        <circle cx="8" cy="7" r="3" fill="none" stroke="#F05033" strokeWidth="1.5" />
        <circle cx="8" cy="17" r="3" fill="none" stroke="#F05033" strokeWidth="1.5" />
        <circle cx="17" cy="17" r="3" fill="none" stroke="#F05033" strokeWidth="1.5" />
        <line x1="8" y1="10" x2="8" y2="14" stroke="#F05033" strokeWidth="1.5" />
        <line x1="8" y1="14" x2="17" y2="14" stroke="#F05033" strokeWidth="1.5" />
      </Svg>
    ),
    "UI Design": (
      <Svg>
        <path
          d="M12 2l-3 5-5 1 3.5 3.5L6 20l6-4 6 4-1.5-8.5L20 8l-5-1-3-5z"
          fill="none"
          stroke="#A855F7"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2" fill="#A855F7" />
      </Svg>
    ),
    "Problem Solving": (
      <Svg>
        <polygon
          points="12,2 22,7 22,17 12,22 2,17 2,7"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <polygon
          points="12,2 22,7 12,12 2,7"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <line x1="12" y1="12" x2="12" y2="22" stroke="#14B8A6" strokeWidth="1" />
      </Svg>
    ),
    "AI-assisted Development": (
      <Svg>
        <path d="M12 3l1.5 4L18 8.5l-4.5 1L12 14l-1.5-4.5L6 8.5l4.5-1.5L12 3z" fill="#F59E0B" />
        <path
          d="M12 14l1.5 3 3 1-3 1.5L12 23l-1.5-3.5-3-1.5 3-1 1.5-3z"
          fill="#F59E0B"
          opacity="0.5"
        />
      </Svg>
    ),
  };

  return icons[name] ?? <span className="text-[10px] font-bold">{name.slice(0, 2)}</span>;
};

export function Skills() {
  const [angle, setAngle] = useState(0);
  const targetRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const sizeRef = useRef({ container: 480, radius: 220 });
  const sectionRef = useRef<HTMLElement>(null);
  const inViewRef = useRef(false);
  const { playTick } = useSound();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    const step = (Math.PI * 2) / SKILLS.length;
    const tick = () => {
      if (targetRef.current !== null) {
        const diff = targetRef.current - angleRef.current;
        angleRef.current += diff * 0.1;
        if (Math.abs(diff) < 0.001) {
          angleRef.current = targetRef.current;
          targetRef.current = null;
        }
      } else {
        const prev = angleRef.current;
        angleRef.current += 0.003;
        const prevSlot = Math.floor(
          (((prev % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / step,
        );
        const currSlot = Math.floor(
          (((angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / step,
        );
        if (prevSlot !== currSlot && inViewRef.current) {
          // sound handled by useEffect on activeIndex change
        }
      }
      setAngle(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = (i: number) => {
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

  const activeIndex = topIndex;

  const prevActiveRef = useRef(activeIndex);
  useEffect(() => {
    if (prevActiveRef.current !== activeIndex && inViewRef.current) {
      playTick();
      prevActiveRef.current = activeIndex;
    } else {
      prevActiveRef.current = activeIndex;
    }
  }, [activeIndex, playTick]);

  const { container, radius } = sizeRef.current;
  const cx = container / 2;
  const cy = container / 2;

  return (
    <section
      ref={sectionRef}
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
              {SKILLS[activeIndex]}
            </div>
            <div className="mx-auto mt-2 h-[2px] w-10 bg-[#F59E0B]" />
          </div>
        </div>

        {SKILLS.map((s, i) => {
          const a = angle + (i * (Math.PI * 2)) / SKILLS.length;
          const x = cx + radius * Math.cos(a);
          const y = cy + radius * Math.sin(a);
          const isSel = activeIndex === i;
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
