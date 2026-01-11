import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildSiteList() {
	const path = resolve(__dirname, '../sitelist/_index.ts');
	const thing = (await import(pathToFileURL(path).href)).default;
	console.log(JSON.stringify(thing, null, 4));
}

buildSiteList();
