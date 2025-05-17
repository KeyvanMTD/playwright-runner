// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'default',
      testDir: '.', // Cible le dossier racine (où tu génères test.spec.ts)
    },
  ],
});
