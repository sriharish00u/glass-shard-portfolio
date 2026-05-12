import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Cursor } from "@/components/Cursor";
import { SideNav } from "@/components/SideNav";
import { GlassBreak } from "@/components/GlassBreak";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Milestones } from "@/components/sections/Milestones";
import { Contact } from "@/components/sections/Contact";
import { useScrollSection } from "@/hooks/useScrollSection";
import { useReveal } from "@/hooks/useReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jay Harish — Full-stack Developer · Safety-tech · Privacy-first" },
      {
        name: "description",
        content:
          "Indie developer from Coimbatore building safety-tech and privacy-first systems across React Native, Node.js, and TypeScript.",
      },
      { property: "og:title", content: "Jay Harish — Full-stack Developer" },
      {
        property: "og:description",
        content: "Safety-tech. Privacy-first. Full-stack systems.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const ids = useMemo(() => ["hero", "about", "skills", "projects", "milestones", "contact"], []);
  const active = useScrollSection(ids);
  useReveal();

  useEffect(() => {
    document.body.style.paddingLeft = window.innerWidth >= 768 ? "56px" : "0";
    const onResize = () => {
      document.body.style.paddingLeft = window.innerWidth >= 768 ? "56px" : "0";
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <main className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen">
      <Cursor />
      <SideNav active={active} />

      <Hero />
      <GlassBreak variant={0} />
      <About />
      <GlassBreak variant={1} />
      <Skills />
      <GlassBreak variant={2} />
      <Projects />
      <GlassBreak variant={3} />
      <Milestones />
      <GlassBreak variant={4} />
      <Contact />

      <footer className="text-center py-10 text-[#F5F0E8]/30 text-xs tracking-[0.25em] uppercase">
        © 2026 Jay Harish · Crafted with care
      </footer>
    </main>
  );
}
