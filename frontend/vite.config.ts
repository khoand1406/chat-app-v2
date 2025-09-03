import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    https: {
      key: fs.readFileSync("../backend/localhost+2-key.pem"),
      cert: fs.readFileSync("../backend/localhost+2.pem"),
    }, 
  },
  
});