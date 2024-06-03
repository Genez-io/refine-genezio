import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import genezioLocalSDKReload from "@genezio/vite-plugin-genezio";

export default defineConfig({
  plugins: [react(), genezioLocalSDKReload()]
});
