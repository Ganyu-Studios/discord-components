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
