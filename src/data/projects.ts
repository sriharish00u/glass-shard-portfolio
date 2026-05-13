export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  githubs: string[];
  live: string | null;
  liveComingSoon?: boolean;
  image: string | null;
}

export const projects: Project[] = [
  {
    id: "01",
    name: "HumaNet",
    description:
      "Privacy-first emergency response platform. Real-time SOS sessions, volunteer guider assignment, Agora video calling, and BLE mesh — built for golden-hour survival.",
    stack: ["React Native", "Expo", "Node.js", "Socket.IO", "MongoDB", "Agora"],
    githubs: [
      "https://github.com/sriharish00u/HumaNet",
      "https://github.com/sriharish00u/Hum-server",
    ],
    live: null,
    liveComingSoon: true,
    image: "humanet.png",
  },
  {
    id: "02",
    name: "ResumePortfolioGenerator",
    description:
      "Full-stack tool to generate resumes and portfolios dynamically. TypeScript monorepo with Drizzle ORM, Tailwind, and live Vercel deployment.",
    stack: ["TypeScript", "React", "Node.js", "Drizzle ORM", "Tailwind", "Vite"],
    githubs: ["https://github.com/sriharish00u/ResumePortfolioGenerator"],
    live: "https://resumeportfoliogenerator.onrender.com",
    image: "resume-portfolio-generator.png",
  },
  {
    id: "03",
    name: "Yoga Evolve",
    description:
      "Offline, privacy-first yoga trainer with adaptive routines and a comprehensive pose library. No data leaves the device — ever.",
    stack: ["HTML", "CSS", "JavaScript"],
    githubs: ["https://github.com/sriharish00u/Yoga-Evolve"],
    live: "https://yoga-evolve.vercel.app/",
    image: "yoga-trainer.png",
  },
];
