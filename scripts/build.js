#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const sharedConfig = {
  bundle: true,
  sourcemap: true,
  platform: 'browser',
  target: ['es2022'],
  format: 'esm',
  minify: process.env.NODE_ENV === 'production',
  logLevel: 'info',
};

async function buildRecorder() {
  console.log('Building Recorder bundle...');
  await esbuild.build({
    ...sharedConfig,
    entryPoints: [join(rootDir, 'src/recorder/index.ts')],
    outfile: join(rootDir, 'dist/recorder.bundle.js'),
    globalName: 'HrefRecorder',
  });
  console.log('✓ Recorder bundle built successfully');
}

async function buildPlayer() {
  console.log('Building Player bundle...');
  await esbuild.build({
    ...sharedConfig,
    entryPoints: [join(rootDir, 'src/player/index.ts')],
    outfile: join(rootDir, 'dist/player.bundle.js'),
    globalName: 'HrefPlayer',
  });
  console.log('✓ Player bundle built successfully');
}

async function buildAll() {
  try {
    await buildRecorder();
    await buildPlayer();
    console.log('\n✓ All bundles built successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildAll();
