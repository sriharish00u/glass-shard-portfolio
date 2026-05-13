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

const SECTIONS = ["hero", "about", "skills", "projects", "milestones", "contact"];

export default function App() {
  useReveal();
  const active = useScrollSection(SECTIONS);

  return (
    <>
      <Cursor />
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
