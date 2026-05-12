import { useState } from "react";
import profile from "@/assets/profile.jpg";
import { useSound } from "@/hooks/useSound";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "milestones", label: "Milestones" },
  { id: "contact", label: "Contact" },
];

export function SideNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const { playClick } = useSound();

  const scrollTo = (id: string) => {
    playClick();
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed top-4 left-4 z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-[#0A0A0A]/80 backdrop-blur border border-white/10 rounded"
        aria-label="Toggle navigation"
      >
        <span
          className={`block w-5 h-px bg-[#F5F0E8] transition ${open ? "rotate-45 translate-y-[6px]" : ""}`}
        />
        <span className={`block w-5 h-px bg-[#F5F0E8] transition ${open ? "opacity-0" : ""}`} />
        <span
          className={`block w-5 h-px bg-[#F5F0E8] transition ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
        />
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen z-[100] flex flex-col items-center py-6
                    bg-[#0A0A0A]/85 backdrop-blur-md border-r border-[#F5F0E8]/[0.08]
                    transition-transform duration-300
                    md:w-14 md:translate-x-0
                    w-56 ${open ? "translate-x-0" : "-translate-x-full"} md:flex`}
      >
        {/* Top: photo + name */}
        <div className="flex flex-col items-center">
          <img
            src={profile}
            alt="Jay Harish"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: "1.5px solid #F59E0B" }}
          />
          <div
            className="hidden md:block mt-3 text-[10px] tracking-[0.15em] text-[#F59E0B]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            JAY HARISH
          </div>
        </div>

        {/* Middle: dot nav */}
        <nav className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="relative flex flex-col items-center gap-7 py-4">
            <span
              aria-hidden
              className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-px"
              style={{ borderLeft: "1px dashed rgba(245,158,11,0.45)" }}
            />
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="relative group z-10"
                  aria-label={s.label}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: 10,
                      height: 10,
                      border: "1.5px solid #F59E0B",
                      background: isActive ? "#F59E0B" : "transparent",
                      transform: isActive ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  <span
                    className="absolute left-[26px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{
                      background: "#F59E0B",
                      color: "#0A0A0A",
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom marker */}
        <div className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/30 hidden md:block">© 26</div>
      </aside>
    </>
  );
}
