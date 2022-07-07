import { babel } from '@rollup/plugin-babel';
import { defineConfig, ModuleFormat } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-ts';

const isDev =
  process.env['NODE_ENV'] === 'development' ||
  process.env['ROLLUP_WATCH'] === 'true';
const formats: ModuleFormat[] = ['esm', 'system'];

const formatToExtension = (format: ModuleFormat) => {
  switch (format) {
    case 'cjs':
    case 'commonjs':
      return 'cjs';
    case 'es':
    case 'esm':
    case 'module':
      return 'mjs';
    default:
      return 'js';
  }
};

const config = defineConfig({
  input: 'src/index.ts',
  external: [/@codecb\//, /^react\/?/, /^react-dom\/?/],
  output: formats.map(format => ({
    dir: `dist/${format}`,
    entryFileNames: `[name].${formatToExtension(format)}`,
    format,
    sourcemap: isDev,
  })),
  plugins: [
    ts(),
    babel({
      babelHelpers: 'bundled',
      presets: [['@codecb/babel', { target: 'browser' }]],
    }),
    !isDev && terser(),
  ],
});

export default config;
