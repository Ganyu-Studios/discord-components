import sapphirePrettierConfig from '@sapphire/prettier-config';

export default {
	...sapphirePrettierConfig,
	plugins: ['prettier-plugin-astro'],
	endOfLine: 'crlf',
	overrides: [
		...sapphirePrettierConfig.overrides.map((set) => {
			return { ...set, options: { ...set.options, endOfLine: 'crlf' } };
		}),
		{
			files: ['*.md'],
			options: {
				tabWidth: 2,
				useTabs: false,
				printWidth: 80,
				proseWrap: 'always'
			}
		},
		{
			files: ['*.svg'],
			options: {
				parser: 'html'
			}
		}
	]
};
