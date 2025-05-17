import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'default',
      testDir: '.', // On exécute les fichiers à la racine, comme test.spec.ts
    },
  ],
});
