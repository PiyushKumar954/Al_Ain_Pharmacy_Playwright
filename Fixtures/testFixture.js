import { test as baseTest, expect } from '@playwright/test';
import { Basetest } from '../Base/Basetest.js';
import Header from '../Pages/Header.js';
import LoginPage from '../Pages/LoginPage.js';
import Footer from '../Pages/Footer.js';
import { highlightElement } from '../Utils/highlighter.js';

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

        loginPage: async ({ page }, use) =>
        {
            await use(new LoginPage(page));
        },

        footer: async ({ page }, use) =>
        {
            await use(new Footer(page));
        },

        logger: async ({ page }, use, testInfo) =>
        {
            const logUtil = {
                verify: async (message, locator = null) => {
                    const time = new Date().toLocaleTimeString();
                    const isFail = message.toLowerCase().startsWith('fail') || message.includes('Fail:');
                    const icon = isFail ? '❌' : '✔';
                    const logMsg = `[${time}] ${icon} [${isFail ? 'FAILED' : 'VERIFIED'}]: ${message}`;
                    console.log(logMsg);
                    await testInfo.attach('Verification Details', {
                        body: logMsg,
                        contentType: 'text/plain'
                    });

                    // On failure, highlight the element and attach screenshot to Allure
                    if (isFail) {
                        try {
                            await page.bringToFront().catch(() => null);

                            if (locator) {
                                await highlightElement(page, locator);
                            }

                            const screenshot = await page.screenshot({ fullPage: false });
                            await testInfo.attach(`Failure Screenshot - ${message.slice(0, 50)}`, {
                                body: screenshot,
                                contentType: 'image/png'
                            });
                        } catch (err) {
                            console.error('Failed to capture failure screenshot:', err.message);
                        }
                    }
                }
            };
            await use(logUtil);
        }
    }
);

export { expect };