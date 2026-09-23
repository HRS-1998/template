import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'umd',
        name: 'sdk',
        sourcemap: false,
      },
    ],

    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**/*.ts'],
        exclude: ['node_modules/**/*'],
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        exclude: 'node_modules/**',
        include: ['src/**/*.js', 'src/**/*.ts'],
      }),
      commonjs(),

      terser(),
    ],
  },
];
