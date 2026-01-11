import manifest from './src/manifest';
import { build } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Polyfill/Shim for Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = __dirname;

async function buildAll() {
    console.log('Rebuilding (Node/Vite)...');
    try {
        await buildSiteList();
        await buildServiceWorker();
        // await buildOptionsPage(); // Removed
        await buildIntercept();
        await buildManifest();

        copy('assets/icon16.png', 'build/assets/icon16.png');
        copy('assets/icon32.png', 'build/assets/icon32.png');
        copy('assets/icon48.png', 'build/assets/icon48.png');
        copy('assets/icon64.png', 'build/assets/icon64.png');
        copy('assets/icon128.png', 'build/assets/icon128.png');

        console.log('Build complete!');
    } catch (e) {
        console.error('Build failed:', e);
        process.exit(1);
    }
}

async function buildServiceWorker() {
    await build({
        root: `${PROJECT_ROOT}/src`,
        build: {
            outDir: `${PROJECT_ROOT}/build`,
            emptyOutDir: false,
            rollupOptions: {
                input: path.resolve(PROJECT_ROOT, 'src/entrypoints/service-worker/service-worker.ts'),
                output: {
                    assetFileNames: 'entrypoints/service-worker/[name].[ext]',
                    entryFileNames: 'entrypoints/service-worker/[name].js'
                },
            },
            minify: false,
        }
    });
}

async function buildSiteList() {
    // We can't easily run the src/dev/build-sitelist.ts with Bun's $.
    // Instead, we will try to run it with tsx in a child process
    console.log('Building sitelist...');
    // We need to capture the output of the script.
    // src/dev/build-sitelist.ts prints JSON to stdout.

    try {
        const output = execSync('npx tsx src/dev/build-sitelist.ts', { encoding: 'utf-8' });
        const siteListJson = output; // Output is already JSON string (hopefully)
        // Verify valid JSON
        JSON.parse(siteListJson);

        const buildDir = path.resolve(PROJECT_ROOT, 'build');
        if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

        fs.writeFileSync(path.resolve(buildDir, 'sitelist.json'), siteListJson);
    } catch (e) {
        console.error('Failed to build sitelist:', e);
        throw e;
    }
}

async function buildIntercept() {
    await build({
        root: `${PROJECT_ROOT}/src`,
        plugins: [solidPlugin()],
        build: {
            outDir: `${PROJECT_ROOT}/build`,
            emptyOutDir: false,
            rollupOptions: {
                input: path.resolve(PROJECT_ROOT, 'src/entrypoints/intercept/intercept.tsx'),
                output: {
                    assetFileNames: 'entrypoints/intercept/[name].[ext]',
                    entryFileNames: 'entrypoints/intercept/[name].js'
                },
            },
            minify: false,
        }
    });
}

async function buildManifest() {
    // fs.writeFileSync('./build/manifest.json', JSON.stringify(manifest, null, 2));
    // manifest is an object imported from .ts
    const buildDir = path.resolve(PROJECT_ROOT, 'build');
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
    fs.writeFileSync(path.resolve(buildDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}

function copy(from: string, to: string) {
    const src = path.resolve(PROJECT_ROOT, from);
    const dest = path.resolve(PROJECT_ROOT, to);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
}

buildAll();
