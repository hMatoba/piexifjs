import typescript from 'rollup-plugin-typescript2';

export default {
  entry: './src/index.ts',
  dest: './dist/piexifjs.js',
  format: 'umd',
  moduleName: 'piexifjs',
  plugins: [
    typescript()
  ]
}