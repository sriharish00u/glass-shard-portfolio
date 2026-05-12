import { projects, type Project } from "@/data/projects";
import { SectionHeader } from "./SectionHeader";

function ProjectCard({ p, idx }: { p: Project; idx: number }) {
  const reverse = idx % 2 === 1;
  return (
    <article
      className="reveal grid md:grid-cols-2 gap-10 md:gap-16 items-center"
      style={{ "--i": idx } as React.CSSProperties}
    >
      {/* Image / placeholder */}
      <div
        className={`group relative overflow-hidden rounded ${reverse ? "md:order-2" : ""}`}
        style={{
          aspectRatio: "16 / 10",
          background: "#111",
          backgroundImage:
            "radial-gradient(rgba(245,158,11,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-[1.04]">
          <span
            className="font-serif"
            style={{ fontSize: "clamp(80px, 14vw, 160px)", color: "rgba(245,158,11,0.15)", lineHeight: 1 }}
          >
            {p.id}
          </span>
          <span
            className="font-serif text-[#F5F0E8]/80 -mt-4"
            style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
          >
            {p.name}
          </span>
        </div>
        <div
          className="absolute inset-0 pointer-events-none transition-shadow duration-300 group-hover:shadow-[inset_3px_0_0_#F59E0B]"
        />
      </div>

      {/* Content */}
      <div>
        <div className="text-[12px] text-[#F59E0B] tracking-[0.25em] opacity-70">
          PROJECT {p.id}
        </div>
        <h3
          className="font-serif text-[#F5F0E8] mt-2"
          style={{ fontSize: "clamp(32px, 4.4vw, 48px)", lineHeight: 1.05 }}
        >
          {p.name}
        </h3>
        <p className="text-[15px] text-[#F5F0E8]/60 leading-[1.7] mt-4">
          {p.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {p.stack.map((t) => (
            <span
              key={t}
              className="text-[11px] text-[#F59E0B] px-2.5 py-1 rounded-sm"
              style={{ border: "1px solid rgba(245,158,11,0.3)" }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 mt-7 text-sm font-medium">
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="story-link text-[#F59E0B]"
            >
              → View Project
            </a>
          )}
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="story-link text-[#F5F0E8]/70 hover:text-[#F5F0E8]"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section
      data-section="projects"
      className="py-24 px-5 md:px-[80px] flex flex-col gap-20"
    >
      <div className="reveal">
        <SectionHeader number="04" title="Projects." />
      </div>
      {projects.map((p, i) => (
        <ProjectCard key={p.id} p={p} idx={i} />
      ))}
    </section>
  );
}
