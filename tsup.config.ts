import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  treeshake: 'smallest',
  minify: false,
  sourcemap: true,
  globalName: 'SceneBridge3D',
  clean: true,
  injectStyle: true,
  external: [
    'three',
 ]
});
