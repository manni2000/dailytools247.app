#!/usr/bin/env node
import { build } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, scriptPath)], {
      stdio: 'inherit',
      env: process.env
    });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Script ${scriptPath} exited with code ${code}`));
    });
  });
}

async function main() {
  const start = Date.now();
  
  // 1. Update sitemap dates
  await runNodeScript('update-sitemap-dates.js');

  // 2. Vite Production Build
  await build();

  // 3. SEO Pre-render all routes and generate vercel.json
  await runNodeScript('prerender.js');

  console.log(`\n🎉 Full build pipeline finished successfully in ${((Date.now() - start)/1000).toFixed(2)}s!`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
