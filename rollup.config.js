import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    file: './dist/piexifjs.js',
    name: 'piexifjs',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    typescript()
  ]
}