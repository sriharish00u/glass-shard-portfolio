export function SectionHeader({
  number,
  title,
  align = "left",
}: {
  number: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`relative ${align === "center" ? "text-center" : ""}`}>
      <span
        aria-hidden
        className="font-serif select-none pointer-events-none absolute"
        style={{
          fontSize: "clamp(120px, 16vw, 200px)",
          color: "rgba(245,158,11,0.05)",
          top: "-40px",
          left: align === "center" ? "50%" : "-10px",
          transform: align === "center" ? "translateX(-50%)" : "none",
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      <div className="relative">
        <div className="text-[11px] tracking-[0.3em] text-[#F59E0B] mb-3 uppercase">
          {number} — Section
        </div>
        <h2
          className="font-serif text-[#F5F0E8]"
          style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
        <div className={`mt-4 h-[2px] w-12 bg-[#F59E0B] ${align === "center" ? "mx-auto" : ""}`} />
      </div>
    </div>
  );
}
