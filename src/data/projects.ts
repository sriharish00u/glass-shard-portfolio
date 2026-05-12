export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  github: string;
  live: string | null;
  image: string | null;
}

export const projects: Project[] = [
  {
    id: "01",
    name: "HumaNet",
    description:
      "Privacy-first emergency response platform. Real-time SOS sessions, volunteer guider assignment, Agora video calling, and BLE mesh — built for golden-hour survival.",
    stack: ["React Native", "Expo", "Node.js", "Socket.IO", "MongoDB", "Agora"],
    github: "https://github.com/sriharish00u/HumaNet",
    live: "https://huma-net.vercel.app",
    image: null,
  },
  {
    id: "02",
    name: "ResumePortfolioGenerator",
    description:
      "Full-stack tool to generate resumes and portfolios dynamically. TypeScript monorepo with Drizzle ORM, Tailwind, and live Vercel deployment.",
    stack: ["TypeScript", "React", "Node.js", "Drizzle ORM", "Tailwind", "Vite"],
    github: "https://github.com/sriharish00u/ResumePortfolioGenerator",
    live: "https://resume-portfolio-generator-amber.vercel.app",
    image: null,
  },
  {
    id: "03",
    name: "Yoga Trainer",
    description:
      "Offline, privacy-first yoga trainer with adaptive routines and a comprehensive pose library. No data leaves the device — ever.",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/sriharish00u/Yoga",
    live: null,
    image: null,
  },
];
