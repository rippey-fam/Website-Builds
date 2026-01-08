import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, "./src/Projects"),
    build: {
        rollupOptions: {
            input: {
                tenThings: resolve(__dirname, "./src/Projects/ThereAreTenPeople/index.html"),
                weatherApp: resolve(__dirname, "./src/Projects/WeatherApp/index.html"),
            },
        },
    },
});
