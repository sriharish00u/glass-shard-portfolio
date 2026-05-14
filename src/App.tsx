import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Milestones } from "./components/sections/Milestones";
import { Contact } from "./components/sections/Contact";

import { Cursor } from "./components/Cursor";
import { SideNav } from "./components/SideNav";
import { useReveal } from "./hooks/useReveal";
import { useScrollSection } from "./hooks/useScrollSection";
import { useEffect, useRef } from "react";
import { useSound } from "./hooks/useSound";

function GlobalClickHandler() {
  const { playClick } = useSound();
  const lastClick = useRef(0);
  useEffect(() => {
    const onClick = () => {
      const now = Date.now();
      if (now - lastClick.current > 120) {
        lastClick.current = now;
        playClick();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [playClick]);
  return null;
}

function ScrollWind() {
  const { playScrollWind, stopScrollWind } = useSound();
  const timer = useRef<number>(0);
  useEffect(() => {
    const onScroll = () => {
      playScrollWind();
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => stopScrollWind(), 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer.current);
      stopScrollWind();
    };
  }, [playScrollWind, stopScrollWind]);
  return null;
}

const SECTIONS = ["hero", "about", "skills", "projects", "milestones", "contact"];

export default function App() {
  useReveal();
  const active = useScrollSection(SECTIONS);

  return (
    <>
      <Cursor />
      <GlobalClickHandler />
      <ScrollWind />
      <SideNav active={active} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Milestones />
        <Contact />
      </main>
    </>
  );
}
