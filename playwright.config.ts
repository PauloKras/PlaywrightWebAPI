import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',           // corrigido: era './specs'
  timeout: 30_000,
  retries: 1,
  reporter: [['html', { open: 'on-failure' }], ['list']],

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


/*
  use: {
    //baseURL: process.env.BASE_URL ?? 'https://practice.expandtesting.com',
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],*/
});