import { sassPlugin } from 'esbuild-sass-plugin';
import { defineConfig, type Options } from 'tsup';

const optionalDependencies = {
	code: 'highlight.js',
	popper: '@popperjs/core',
	voice: 'wavesurfer.js'
};

const ENABLED_OPTIONAL_DEPENDENCIES = true;

const optionalDependenciesEntries = Object.entries(optionalDependencies);
const totalFilesPosibilities = 2 ** optionalDependenciesEntries.length;

const baseConfig: Options = {
	target: 'es2022',
	clean: true,
	sourcemap: true,
	keepNames: true,
	tsconfig: 'src/tsconfig.json',
	entry: ['src/index.ts'],
	outDir: 'dist/bundle',
	bundle: true,
	platform: 'browser',
	minify: true,
	external: [],
	noExternal: ['lit', '@lit/context'],
	format: 'esm',
	outExtension: () => ({ js: '.mjs' })
};

const allFilesPosibilities: ReturnType<typeof defineConfig>[] = [];

if (ENABLED_OPTIONAL_DEPENDENCIES) {
	for (let index = 0; index < totalFilesPosibilities; index++) {
		const binary = index.toString(2).padStart(optionalDependenciesEntries.length, '0');

		const noExternal: string[] = [];
		const included: string[] = [];

		for (const [idx, [name, value]] of optionalDependenciesEntries.entries()) {
			const isIncluded = binary[idx] === '1';

			if (isIncluded) {
				noExternal.push(value);
				included.push(name);
			}
		}

		allFilesPosibilities.push(
			defineConfig({
				...baseConfig,
				entry: {
					[`index${included.length > 0 ? '+' + included.join('+') : ''}`]: 'src/index.ts'
				},
				noExternal: [...baseConfig.noExternal!, ...noExternal]
			})
		);
	}
}

export default [
	defineConfig({
		clean: true,
		sourcemap: true,
		keepNames: true,
		entry: ['src/styles/base.scss'],
		outDir: 'dist/bundle',
		bundle: true,
		platform: 'browser',
		minify: true,
		external: [],
		noExternal: ['highlight.js'],
		esbuildPlugins: [sassPlugin()]
	}),
	...allFilesPosibilities,
	...(ENABLED_OPTIONAL_DEPENDENCIES
		? []
		: [
				defineConfig({
					...baseConfig,
					entry: {
						index: 'src/index.ts'
					},
					noExternal: [...baseConfig.noExternal!, ...Object.values(optionalDependencies)]
				})
			])
];
