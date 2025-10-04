import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5175,
	},
	resolve: {
		alias: {
			"@sass": path.resolve(__dirname, "src/sass"),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
          @use "@sass/variables" as *;
          @use "@sass/mixins" as *;
          @use "@sass/custom" as *;
        `,
			},
		},
	},
});
