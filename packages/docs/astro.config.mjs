import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"

export default defineConfig({
	site: "https://jamestasse.tech",
	base: "/portfolio/docs",
	devToolbar: {
		enabled: false,
	},
	vite: {
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
	integrations: [
		starlight({
			title: "Portfolio Documentation",
			tableOfContents: {
				minHeadingLevel: 2, // Skip h1, start from h2
				maxHeadingLevel: 4,
			},
			social: {
				github: "https://github.com/jtasse/jtt",
			},
			head: [
				{
					tag: "script",
					content: `
						// Theme synchronization
						(function() {
							function applyTheme(theme) {
								if (!theme || theme === 'auto') {
									const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
									document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
								} else {
									document.documentElement.dataset.theme = theme;
								}
							}

							window.addEventListener('storage', (e) => {
								if (e.key === 'starlight-theme') {
									applyTheme(e.newValue);
								}
							});

							window.addEventListener('message', (e) => {
								if (e.data && e.data.type === 'THEME_CHANGE') {
									localStorage.setItem('starlight-theme', e.data.theme);
									applyTheme(e.data.theme);
								}
							});
						})();

						document.addEventListener("DOMContentLoaded", () => {
							const targets = document.querySelectorAll("a[rel='prev']");
							targets.forEach(el => {
								if (el.textContent.includes("← jamestasse.tech/portfolio")) {
									el.remove();
								}
							});
						});
					`,
				},
				// Favicon links
				{
					tag: "link",
					attrs: {
						rel: "apple-touch-icon",
						sizes: "180x180",
						href: "/favicon/apple-touch-icon.png",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "icon",
						type: "image/png",
						sizes: "32x32",
						href: "/favicon/favicon-32x32.png",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "icon",
						type: "image/png",
						sizes: "16x16",
						href: "/favicon/favicon-16x16.png",
					},
				},
				{
					tag: "link",
					attrs: { rel: "manifest", href: "/favicon/site.webmanifest" },
				},
				{
					tag: "link",
					attrs: { rel: "shortcut icon", href: "/favicon/favicon.ico" },
				},
			],
			sidebar: [
				{
					label: "← jamestasse.tech/portfolio",
					link: "/../../portfolio",
					attrs: { class: "portfolio-link" },
				},
				{
					label: "ORC",
					items: [
						{ label: "Introduction", slug: "orc" },
						{
							label: "Getting Started Tutorial",
							slug: "orc/getting-started-tutorial",
						},
						{ label: "User Guide", slug: "orc/user-guide" },
						{ label: "API Reference", slug: "orc/api-reference" },
						{
							label: "UI Reference Guide",
							slug: "orc/ui-reference-guide",
						},
						{ label: "Whitepaper", slug: "orc/whitepaper" },
					],
				},
				// Future: Add more app sections here
			],
			customCss: ["./src/styles/custom-theme.css"],
		}),
	],
})
