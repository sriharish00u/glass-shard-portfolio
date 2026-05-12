import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    define: {
      global: "globalThis",
      process: {
        env: {},
      },
    },

    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },

    server: {
      allowedHosts: ["glass-shard-portfolio.onrender.com"],
    },
  },
});
