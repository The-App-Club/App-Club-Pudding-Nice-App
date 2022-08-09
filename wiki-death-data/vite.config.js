// vite.config.js
import {resolve} from 'path';
import {defineConfig} from 'vite';

module.exports = defineConfig({
  base: './',
  root: 'src',
  build: {
    outDir: `${__dirname}/dist`,
  },
});
