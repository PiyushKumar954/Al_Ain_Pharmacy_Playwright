import { test as baseTest, expect } from '@playwright/test';
import { Basetest } from '../Base/Basetest.js';
import Header from '../Pages/Header.js';
import LoginPage from '../Pages/LoginPage.js';
import Footer from '../Pages/Footer.js';
import Logger from '../Utils/logger.js';

export const test = baseTest.extend(
    {
        sharedPage: [async ({ browser }, use) => {
            const isHeaded = browser._options?.headless === false || process.argv.includes('--headed');
            const context = await browser.newContext({
                viewport: isHeaded ? null : { width: 1920, height: 1080 }
            });
            const page = await context.newPage();
            const base = new Basetest(page);
            await base.beforeTest();

            await use(page);

            await base.afterTest();
            await context.close();
        }, { scope: 'worker' }],

        page: async ({ sharedPage }, use) => {
            await use(sharedPage);
        },

        header: async ({ page, logger }, use) => 
        {
            await use(new Header(page, logger));
        },

        loginPage: async ({ page, logger }, use) => {
            await use(new LoginPage(page, logger));
        },

        footer: async ({ page, logger }, use) =>
        {
            await use(new Footer(page, logger));
        },

        logger: async ({ page }, use, testInfo) =>
        {
            const loggerInstance = new Logger(page, testInfo);
            await use(loggerInstance);
        }
    }
);

export { expect };