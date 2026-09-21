// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  base: "/kinect-stretch",
  build: {
    assets: "_compiled",
  },
  integrations: [react()],
});
