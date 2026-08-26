import { defineConfig } from 'tsdown';

export default defineConfig({
	target: 'es2022',
	clean: true,
	sourcemap: true,
	keepNames: true,
	tsconfig: 'src/tsconfig.json',
	entry: ['src/index.ts', 'src/styles/base.scss'],
	outDir: 'dist/bundle',
	// The bundle is the CDN artifact (JS + CSS only); type declarations come from build:ts (tsc).
	dts: false,
	platform: 'browser',
	minify: true,
	// Bundle the runtime libraries into the browser bundle instead of externalizing them, so the CDN
	// build is self-contained. tsdown externalizes dependencies by default and matches noExternal
	// exactly, so the regex is needed to also catch subpaths (e.g. lit/decorators.js) — otherwise
	// they stay as bare specifiers the browser cannot resolve.
	noExternal: [/^(?:lit|@lit\/context|highlight\.js|wavesurfer\.js|@popperjs\/core|pako)(?:\/|$)/],
	format: 'esm',
	outExtensions: () => ({ js: '.mjs' }),
	// Preserve the published CSS path (dist/bundle/styles/base.css) that consumers load from the CDN;
	// @tsdown/css would otherwise emit it as style.css.
	css: {
		fileName: 'styles/base.css',
		minify: true
	}
});
