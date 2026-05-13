import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Milestones from "./components/sections/Milestones";
import Contact from "./components/sections/Contact";

import Cursor from "./components/Cursor";
import SideNav from "./components/SideNav";

export default function App() {
  return (
    <>
      <Cursor />
      <SideNav />

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
