// eslint.config.js
import globals from "globals"
import js from "@eslint/js"
import prettier from "eslint-config-prettier"

export default [
	// 1. Global ignores
	{
		ignores: ["dist/**", "node_modules/**", "public/**"],
	},
	// 2. Base JavaScript configuration
	js.configs.recommended,
	// 3. Project specific rules
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.es2021,
				THREE: "readonly", // If you use THREE as a global, otherwise remove this
			},
		},
	},
	// 4. Node.js scripts configuration
	{
		files: ["scripts/**", "src/scripts/**", "tests/**"],
		languageOptions: {
			globals: { ...globals.node },
		},
		rules: {
			// Error prevention
			"no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
			"no-undef": "error",
			"no-duplicate-imports": "error",

			// Best practices
			eqeqeq: ["error", "always"],
			"no-var": "error",
			"prefer-const": "warn",

			// Three.js specific safety (prevents common performance killers)
			"no-console": ["warn", { allow: ["warn", "error", "info"] }],
		},
	},
	// 5. Prettier config (must be last to override formatting rules)
	prettier,
]
