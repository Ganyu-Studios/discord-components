import { rm } from 'node:fs';
import { defineConfig, type Options } from 'tsdown';

const baseOptions: Options = {
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	minify: false,
	sourcemap: true,
	target: 'es2022',
	tsconfig: 'src/tsconfig.json',
	keepNames: true,
	banner: {
		js: '"use client";'
	}
};

// rmdir's recursive option is gone in newer Node versions; rm is the replacement.
rm('dist/core-bundle', { recursive: true, force: true }, () => {});

export default [
	defineConfig({
		...baseOptions,
		outDir: 'dist/cjs',
		format: 'cjs',
		outExtensions: () => ({ js: '.cjs' })
	}),
	defineConfig({
		...baseOptions,
		outDir: 'dist/esm',
		format: 'esm',
		outExtensions: () => ({ js: '.mjs' })
	})
];
