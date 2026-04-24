import { defineConfig } from 'orval';

export default defineConfig({
  projects: {
    input: {
      target: './openapi.json',
    },
    output: {
      workspace: './src/api',
      target: './index.ts',
      schemas: './models',
      mode: 'tags-split',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      mock: false,
    },
  },
});