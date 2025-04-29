import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'SceneBridge3D',
      globals: {
        three: 'THREE'
      },
      exports: 'default'
    }
  ],
  external: ['three'],
  plugins: [
    nodeResolve(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          esModuleInterop: true
        }
      }
    })
  ]
};
