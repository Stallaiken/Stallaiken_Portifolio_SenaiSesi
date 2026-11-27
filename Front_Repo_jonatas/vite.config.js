import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O front chama /api e /uploads; o Vite encaminha para o back-end (porta 3000).
const backend = {
  "/api": "http://localhost:3000",
  "/uploads": "http://localhost:3000",
};

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: backend },
  preview: { proxy: backend },
});
