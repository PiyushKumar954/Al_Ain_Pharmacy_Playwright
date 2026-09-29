import { test as baseTest, expect } from '@playwright/test';
import { Basetest } from '../Base/Basetest.js';
import Header from '../Pages/Header.js';
import LoginPage from '../Pages/LoginPage.js';
import Footer from '../Pages/Footer.js';
import Logger from '../Utils/logger.js';

export const test = baseTest.extend(
    {
        sharedPage: [async ({ browser }, use) => {
            const context = await browser.newContext({ viewport: null });
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

        header: async ({ page }, use) => 
        {
            await use(new Header(page));
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