import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3000',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    },
    webServer: {
        command: 'npm run start-server',
        url: 'http://localhost:3000/books',
        reuseExistingServer: !process.env.CI,
        timeout: 10000,
    },
});
