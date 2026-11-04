import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site:    'https://www.telos.cl',
  output:  'server',
  adapter: netlify(),
});
