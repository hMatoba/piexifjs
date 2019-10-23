import typescript from 'rollup-plugin-typescript2';
import { eslint } from 'rollup-plugin-eslint';

export default {
  input: './src/index.ts',
  output: {
    file: './dist/piexif.js',
    name: 'piexif',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    eslint({ include: 'src/', throwOnError: true, throwOnWarning: true }),
  ],
};
