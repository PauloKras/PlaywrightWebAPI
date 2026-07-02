import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',           // corrigido: era './specs'
  timeout: 30_000,
  retries: 1,
  //reporter: [['html', { open: 'on-failure' }], ['list']],
  reporter: [['html', { open: 'never' }], ['list']], // alterado 'on-failure' para 'never' na pipeline
  
  use: {
    trace: 'retain-on-failure', // Isso vai gravar um raio-x do teste se ele falhar
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: process.env.BASE_URL_API, // https://.../notes/api
      },
    },
    {
      name: 'web',
      testMatch: '**/web/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL, // https://.../notes/app
      },
    },
  ],
});