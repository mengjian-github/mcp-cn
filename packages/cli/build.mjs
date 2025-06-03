import { config } from "dotenv"
import * as esbuild from "esbuild"

// Load environment variables into a define object
config()
const define = {}

for (const k in process.env) {
  /* Skip environment variables that should be evaluated at runtime */
  if (["HOME", "USER", "XDG_CONFIG_HOME"].includes(k)) continue

  define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const buildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  minify: true,
  treeShaking: true,
  outfile: "dist/index.js",
  define,
  banner: {
    js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`
  },
  external: [
    'os',
    'tty',
    'path',
    'fs',
    'module',
    'url',
    'child_process',
    'crypto',
    'util',
    'stream',
    'events',
    'net',
    'tls',
    'http',
    'https',
    'zlib',
    'buffer'
  ]
}

// Check if watch mode is enabled
const isWatchMode = process.argv.includes('--watch')

if (isWatchMode) {
  const ctx = await esbuild.context(buildOptions)
  await ctx.watch()
  console.log('Watching for changes...')
} else {
  await esbuild.build(buildOptions)
} 