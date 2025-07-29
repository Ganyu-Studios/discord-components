import { sassPlugin } from 'esbuild-sass-plugin';
import { defineConfig } from 'tsup';

export default [
	defineConfig({
		target: 'es2022',
		clean: true,
		sourcemap: true,
		keepNames: true,
		tsconfig: 'src/tsconfig.json',
		entry: ['src/index.ts', 'src/styles/base.scss'],
		outDir: 'dist/bundle',
		bundle: true,
		platform: 'browser',
		minify: true,
		external: [],
		noExternal: ['lit', '@lit/context', 'highlight.js', 'wavesurfer.js'],
		format: 'esm',
		esbuildPlugins: [sassPlugin()],
		outExtension: () => ({ js: '.mjs' })
	})
];
