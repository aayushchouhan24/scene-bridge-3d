import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['three'],
  plugins: [
    nodeResolve(),
    typescript({ useTsconfigDeclarationDir: true })
  ]
};
