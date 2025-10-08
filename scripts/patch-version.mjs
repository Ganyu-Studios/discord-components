#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

function usage() {
	console.error('Usage: pnpm patch:version <version> [--dry-run]');
	process.exit(2);
}

const args = process.argv.slice(2);
if (args.length === 0) usage();

const version = args[0];
const dryRun = args.includes('--dry-run');

if (!/^\d+\.\d+\.\d+(?:[-+].*)?$/.test(version)) {
	console.error('Invalid semver version:', version);
	process.exit(2);
}

const __filename = fileURLToPath(import.meta.url);
const rootPath = resolve(__filename, '..', '..');

const targets = ['packages/core/package.json', 'packages/react-render/package.json'];

(async () => {
	try {
		for (const rel of targets) {
			const filePath = resolve(rootPath, rel);
			const raw = await readFile(filePath, 'utf8');
			const pkg = JSON.parse(raw);
			const old = pkg.version;
			pkg.version = version;

			// preserve tab indentation used in repo package.json files
			const out = JSON.stringify(pkg, null, '\t') + '\n';

			if (dryRun) {
				console.log(`[dry-run] Would update ${rel} from ${old} -> ${version}`);
			} else {
				await writeFile(filePath, out, 'utf8');
				console.log(`Updated ${rel} from ${old} -> ${version}`);
			}
		}
	} catch (err) {
		console.error('Failed to update versions:', err.message);
		process.exitCode = 1;
	}
})();
