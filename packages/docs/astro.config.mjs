import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"

export default defineConfig({
	site: "https://jamestasse.tech",
	base: "/portfolio/docs",
	devToolbar: {
		enabled: false,
	},
	integrations: [
		starlight({
			title: "Portfolio Documentation",
			social: {
				github: "https://github.com/jtasse/jtt",
			},
			head: [],
			sidebar: [
				{
					label: "ORC",
					items: [
						{ label: "Overview", slug: "orc" },
						{
							label: "Getting Started Tutorial",
							slug: "orc/tutorial",
						},
						{ label: "User Guide", slug: "orc/user-guide" },
						{ label: "API Reference", slug: "orc/api-reference" },
						{ label: "Whitepaper", slug: "orc/whitepaper" },
					],
				},
				// Future: Add more app sections here
			],
			customCss: ["./src/styles/custom-theme.css"],
		}),
	],
})
