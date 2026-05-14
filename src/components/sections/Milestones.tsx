import { useState, useCallback } from "react";
import { SectionHeader } from "./SectionHeader";
import { useSound } from "@/hooks/useSound";

interface MilestoneCard {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  image?: string;
}

const CARDS: MilestoneCard[] = [
  {
    type: "HACKATHON",
    title: "Chakravyuha Hackathon",
    subtitle: "JJCET · Trichy · 2026",
    description:
      "Built and presented technical solutions in a competitive collaborative engineering environment focused on rapid execution, system thinking, and real-world problem solving.",
    year: "2026",
    image: "chakravyuha-hackathon.png",
  },
  {
    type: "CERTIFICATION",
    title: "Fundamentals of Web Development",
    subtitle: "IBM",
    description:
      "Frontend and web fundamentals covering HTML, CSS, JavaScript, responsive design, and modern web architecture principles.",
    year: "2026",
    image: "ibm-web-dev.png",
  },
  {
    type: "CERTIFICATION",
    title: "Intermediate Backend Development with Java",
    subtitle: "SoloLearn",
    description:
      "Backend programming concepts using Java including object-oriented design, application logic, multithreading, and structured development workflows.",
    year: "2026",
    image: "sololearn-java.png",
  },
  {
    type: "CERTIFICATION",
    title: "Intermediate Backend Development with Python",
    subtitle: "SoloLearn",
    description:
      "Python backend and scripting fundamentals including automation, data structures, modular programming, and problem-solving workflows.",
    year: "2026",
    image: "sololearn-python.png",
  },
];

const CARD_W = 520;
const CARD_H = 320;

function Arrow({
  dir,
  onClick,
  onHover,
}: {
  dir: "left" | "right";
  onClick: () => void;
  onHover: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      data-hover
      className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
      style={{
        width: 44,
        height: 44,
        border: "1.5px solid rgba(245,158,11,0.5)",
        background: "transparent",
        color: "#F5F0E8",
      }}
      aria-label={dir === "left" ? "Previous milestone" : "Next milestone"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
      </svg>
    </button>
  );
}

export function Milestones() {
  const [active, setActive] = useState(0);
  const { playPop, playClick, playPageFlip } = useSound();

  const goNext = useCallback(() => {
    playPageFlip();
    setActive((a) => (a + 1) % CARDS.length);
  }, [playPageFlip]);

  const goPrev = useCallback(() => {
    playPageFlip();
    setActive((a) => (a - 1 + CARDS.length) % CARDS.length);
  }, [playPageFlip]);

  const card = CARDS[active];

  const computeStyle = (index: number) => {
    const diff = index - active;

    if (diff === 0) {
      return {
        transform: "translate(0, 0) scale(1) rotate(0deg)",
        opacity: 1,
        zIndex: 100,
        pointerEvents: "auto" as const,
      };
    }

    if (diff > 0) {
      const s = 1 - diff * 0.03;
      const x = diff * 10;
      const y = diff * 5;
      const op = Math.max(0, 1 - diff * 0.18);
      return {
        transform: `translate(${x}px, ${y}px) scale(${s}) rotate(0deg)`,
        opacity: op,
        zIndex: 100 - diff,
        pointerEvents: "none" as const,
      };
    }

    // Exited cards — flung up-right
    return {
      transform: "translate(80px, -24px) scale(0.93) rotate(6deg)",
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    };
  };

  const canGoPrev = true;
  const canGoNext = true;

  return (
    <section
      data-section="milestones"
      className="relative min-h-[80vh] flex flex-col items-center py-24 px-5 md:px-[80px]"
    >
      <div className="reveal w-full max-w-3xl">
        <SectionHeader number="06" title="Milestones." align="center" />
      </div>

      {/* Stacked deck + arrows */}
      <div
        className="reveal relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 mt-16 w-full"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {/* Card stack */}
        <div
          className="relative w-full max-w-[90vw] md:max-w-none"
          style={{
            maxWidth: CARD_W,
            aspectRatio: `${CARD_W} / ${CARD_H}`,
          }}
        >
          {/* Year watermark behind stack */}
          <span
            aria-hidden
            className="font-serif absolute select-none pointer-events-none"
            style={{
              fontSize: "clamp(80px, 12vw, 140px)",
              color: "rgba(245,158,11,0.04)",
              bottom: "-10px",
              right: "-10px",
              lineHeight: 1,
            }}
          >
            {card.year}
          </span>

          {CARDS.map((c, i) => {
            const s = computeStyle(i);
            const isActive = i === active;
            return (
              <div
                key={i}
                className="absolute inset-0 rounded-sm transition-all duration-[650ms]"
                style={{
                  ...s,
                  transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
                  background: "#0D0D0D",
                  border: "1px solid rgba(245,158,11,0.08)",
                  boxShadow: isActive
                    ? "inset 0 0 40px rgba(245,158,11,0.03), 0 4px 24px rgba(0,0,0,0.5)"
                    : "inset 0 0 20px rgba(245,158,11,0.01), 0 2px 12px rgba(0,0,0,0.4)",
                  overflow: "hidden",
                }}
              >
                {/* Subtle radial grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(245,158,11,0.06) 0.5px, transparent 0.5px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.4,
                  }}
                />

                {/* Inner glow */}
                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.04) 0%, transparent 60%)",
                    }}
                  />
                )}

                {/* Certificate image */}
                {isActive && c.image && (
                  <div
                    className="absolute inset-0 flex items-center justify-center p-4"
                    style={{ animation: "fadeContent 0.5s ease" }}
                  >
                    <img
                      src={new URL(`/src/assets/${c.image}`, import.meta.url).href}
                      alt={c.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrows below card on mobile, beside on desktop */}
        <div className="flex md:hidden items-center justify-center gap-6 mt-2">
          <div
            className={`transition-opacity duration-300 ${canGoPrev ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Arrow dir="left" onClick={goPrev} onHover={playPop} />
          </div>
          <div
            className={`transition-opacity duration-300 ${canGoNext ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Arrow dir="right" onClick={goNext} onHover={playPop} />
          </div>
        </div>

        {/* Desktop arrows */}
        <div className="hidden md:flex items-center gap-4">
          <div
            className={`transition-opacity duration-300 ${canGoPrev ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Arrow dir="left" onClick={goPrev} onHover={playPop} />
          </div>
          <div
            className={`transition-opacity duration-300 ${canGoNext ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Arrow dir="right" onClick={goNext} onHover={playPop} />
          </div>
        </div>
      </div>

      {/* Details panel */}
      <div
        className="reveal mt-12 w-full text-center"
        style={{ maxWidth: 700, "--i": 2 } as React.CSSProperties}
      >
        <h3
          className="font-serif text-[#F5F0E8]"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.15 }}
        >
          {card.title}
        </h3>
        <p
          className="mt-4 text-[14px] md:text-[15px] text-[#F5F0E8]/55 leading-[1.8]"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {card.description}
        </p>
      </div>

      <style>{`@keyframes fadeContent { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}
