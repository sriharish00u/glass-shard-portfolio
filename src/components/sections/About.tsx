import { SectionHeader } from "./SectionHeader";

const TEXT =
  "I'm an indie developer from Coimbatore, building full-stack systems that prioritize people's safety and privacy. I work across React Native, Node.js, and TypeScript — from mobile apps to backend architecture. My projects span emergency response platforms, cultural software rooted in Tamil heritage, and privacy-first tools built to last.";

export function About() {
  const words = TEXT.split(" ");
  return (
    <section
      data-section="about"
      className="relative min-h-[60vh] mx-auto py-24 px-5 md:px-6"
      style={{ maxWidth: 820 }}
    >
      <div className="reveal">
        <SectionHeader number="02" title="About." />
      </div>

      <p
        className="reveal mt-10 text-[#F5F0E8]/85 leading-[2]"
        style={{ fontSize: "clamp(18px, 2.2vw, 24px)", "--i": 1 } as React.CSSProperties}
      >
        {words.map((w, i) => (
          <span key={i} className="word" data-hover>
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}
