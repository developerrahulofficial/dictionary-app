import glob from "glob";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "",
  root: path.join(__dirname, "src"),
  build: {
    outDir: path.join(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: glob.sync(path.resolve(__dirname, "src", "*.html")),
    },
    sourcemap: true,
  },
});
