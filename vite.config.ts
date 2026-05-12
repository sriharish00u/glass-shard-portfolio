import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    define: {
      process: {},
      "process.env": {},
    },

    server: {
      allowedHosts: ["glass-shard-portfolio.onrender.com"],
    },
  },
});
