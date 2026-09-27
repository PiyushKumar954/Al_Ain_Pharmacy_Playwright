import { test, expect } from '../Fixtures/testFixture.js';
import { getFooterLinkItem, getQuicklinkFooterData, getHelpSupportFooterData, getMyAccountsFooterData, getSocialMediaFooterData, getAppStoresFooterData } from '../Utils/dataProvider.js';

test.describe('Footer Module Regression Tests', () => {

    test('TC01 - Validate Footer Container Visibility after Scrolling', async ({ footer, logger }) => {
        await test.step('Scroll to Footer and verify Footer container is visible', async () => {
            await footer.scrollToFooter();
            await expect(footer.footerContainer).toBeVisible();
            await logger.verify('Footer container is visible on the page');
        });
    });

    test('TC02 - Validate Top Service and Benefit Section', async ({ footer, logger }) => {
        await test.step('Verify Free Shipping section icon and text are displayed', async () => {
            await footer.scrollToFooter();

            await expect(footer.freeShippingIcon).toBeVisible();
            await logger.verify('Free Shipping icon is displayed in footer benefits section');
            await expect(footer.freeShippingText).toBeVisible();
            const actualText = await footer.getFreeShippingText();
            const expectedText = 'Free Shipping';
            await logger.verify(`Retrieved Free Shipping text: "${actualText}"`);
            if (actualText.includes(expectedText)) {
                await logger.verify(`Pass: Free Shipping text "${actualText}" matches expected "${expectedText}"`);
                expect(actualText).toContain(expectedText);
            } else {
                throw new Error(`Fail: Expected "${expectedText}" but got "${actualText}"`);
            }
        });

        await test.step('Verify Supported 24/7 section icon and text are displayed', async () => {
            await expect(footer.supported247Icon).toBeVisible();
            await logger.verify('Supported 24/7 icon is displayed in footer benefits section');
            await expect(footer.supported247Text).toBeVisible();
            const actualText = await footer.getSupported247Text();
            const expectedText = 'Supported 24/7';
            await logger.verify(`Retrieved Supported 24/7 text: "${actualText}"`);
            if (actualText.includes(expectedText)) {
                await logger.verify(`Pass: Supported 24/7 text "${actualText}" matches expected "${expectedText}"`);
                expect(actualText).toContain(expectedText);
            } else {
                throw new Error(`Fail: Expected "${expectedText}" but got "${actualText}"`);
            }
        });

        await test.step('Verify 100% Payment Secure section icon and text are displayed', async () => {
            await expect(footer.paymentSecureIcon).toBeVisible();
            await logger.verify('100% Payment Secure icon is displayed in footer benefits section');
            await expect(footer.paymentSecureText).toBeVisible();
            const actualText = await footer.getPaymentSecureText();
            const expectedText = '100% Payment Secure';
            await logger.verify(`Retrieved 100% Payment Secure text: "${actualText}"`);
            if (actualText.includes(expectedText)) {
                await logger.verify(`Pass: Payment Secure text "${actualText}" matches expected "${expectedText}"`);
                expect(actualText).toContain(expectedText);
            } else {
                throw new Error(`Fail: Expected "${expectedText}" but got "${actualText}"`);
            }
        });
    });

    test('TC03 - Validate Company Logo and Contact Information', async ({ footer, page, logger }) => {
        await test.step('Verify company logo is displayed and redirection', async () => {
            await footer.scrollToFooter();
            const expectedUrl = 'https://alainpharmacy.ae/';
            await expect(footer.footerLogo).toBeVisible();
            await logger.verify('Footer company logo is visible');
            
            await footer.clickFooterLogo();
            await page.waitForTimeout(15000);
            await page.waitForLoadState('domcontentloaded');

            const actualUrl = page.url();
            if (actualUrl === expectedUrl) {
                await logger.verify(`Pass: Actual URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
                expect(actualUrl).toContain('alainpharmacy.ae');
            } else {
                await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`);
                expect.soft(actualUrl, `Expected URL "${expectedUrl}" but got "${actualUrl}"`).toContain('alainpharmacy.ae');
            }
            await page.goBack({ waitUntil: 'domcontentloaded' });
        });

        await test.step('Verify phone number logo and text are visible, clickable', async () => {
            await footer.scrollToFooter();

            await expect(footer.phoneIcon).toBeVisible();
            await expect(footer.phoneText).toBeVisible();
            await logger.verify('Phone number logo and text are visible');

            const isPhoneTextClickable = await footer.isClickable(footer.phoneText);
            if (isPhoneTextClickable) {
                await logger.verify('Phone number text is clickable');
            } else {
                await logger.verify('Phone number text is not clickable');
            }

            const isPhoneIconClickable = await footer.isClickable(footer.phoneIcon);
            if (isPhoneIconClickable) {
                await logger.verify('Phone number logo is clickable');
                expect(isPhoneIconClickable).toBeTruthy();
            } else {
                await logger.verify('Phone number logo is not clickable');
                expect.soft(isPhoneIconClickable, 'Fail: Phone number logo is not clickable').toBeTruthy();
            }
        });  

        await test.step('Verify email address logo and text are visible and clickable', async () => {
            await footer.scrollToFooter();

            await expect(footer.emailIcon).toBeVisible();
            await expect(footer.emailText).toBeVisible();
            await logger.verify('Email address logo and text are visible');

            const isEmailTextClickable = await footer.isClickable(footer.emailText);
            if (isEmailTextClickable) {
                await logger.verify('Email address text is clickable');
            } else {
                await logger.verify('Email address text is not clickable');
            }

            const isEmailIconClickable = await footer.isClickable(footer.emailIcon);
            if (isEmailIconClickable) {
                await logger.verify('Email address logo is clickable as button/link type');
                expect(isEmailIconClickable).toBeTruthy();
            } else {
                await logger.verify('Email address logo is not clickable');
                expect.soft(isEmailIconClickable, 'Fail: Email address logo is not clickable').toBeTruthy();
            }
        });
    });

    test('TC04 - Validate Quick Links in Footer Section', async ({ footer, page, logger }) => {
        await test.step('Verify Quick Links section is visible in footer', async () => {
            await footer.scrollToFooter();
            await expect(footer.quickLinks).toBeVisible();
            await expect(footer.quickLinksHeading).toBeVisible();
            await logger.verify('Quick Links section is visible in the footer section');
        });

        await test.step('Display and log all item names showing under Quick Links', async () => {
            await footer.scrollToFooter();
            const quickLinks = await footer.getQuickLinkItems();
            await logger.verify(`Total Quick Links items retrieved: ${quickLinks.length}`);
            expect(quickLinks.length).toBeGreaterThan(0);

            for (let i = 0; i < quickLinks.length; i++) {
                await logger.verify(`Quick Link Item ${i + 1}: "${quickLinks[i]}"`);
            }
        });

        const quickLinksData = getQuicklinkFooterData();
        for (const { linkName, expectedUrl } of quickLinksData) {
            await test.step(`Validate "${linkName}" link visibility, clickability, and URL navigation`, async () => {
                await footer.validateFooterLink(linkName, expectedUrl, logger);
            });
        }
    });
    test('TC05 - Validate Help & Support in Footer Section', async ({ footer, page, logger }) => {
        await test.step('Verify Help & Support section is visible in footer', async () => {
            await footer.scrollToFooter();
            await expect(footer.helpSupport).toBeVisible();
            await expect(footer.helpSupportHeading).toBeVisible();
            await logger.verify('Help & Support section is visible in the footer section');
        });

        await test.step('Display and log all item names showing under Help & Support', async () => {
            await footer.scrollToFooter();
            const helpSupportLinks = await footer.getHelpSupportItems();
            await logger.verify(`Total Help & Support items retrieved: ${helpSupportLinks.length}`);
            expect(helpSupportLinks.length).toBeGreaterThan(0);

            for (let i = 0; i < helpSupportLinks.length; i++) {
                await logger.verify(`Help & Support Item ${i + 1}: "${helpSupportLinks[i]}"`);
            }
        });

        const helpSupportData = getHelpSupportFooterData();
        for (const { linkName, expectedUrl } of helpSupportData) {
            await test.step(`Validate "${linkName}" link visibility, clickability, and URL navigation`, async () => {
                await footer.validateFooterLink(linkName, expectedUrl, logger);
            });
        }
    });

    test('TC06 - Validate My Accounts in Footer Section', async ({ footer, page, logger }) => {
        await test.step('Verify My Accounts section is visible in footer', async () => {
            await footer.scrollToFooter();
            await expect(footer.myAccounts).toBeVisible();
            await expect(footer.myAccountsHeading).toBeVisible();
            await logger.verify('My Accounts section is visible in the footer section');
        });

        await test.step('Display and log all item names showing under My Accounts', async () => {
            await footer.scrollToFooter();
            const myAccountsLinks = await footer.getMyAccountsItems();
            await logger.verify(`Total My Accounts items retrieved: ${myAccountsLinks.length}`);
            expect(myAccountsLinks.length).toBeGreaterThan(0);

            for (let i = 0; i < myAccountsLinks.length; i++) {
                await logger.verify(`My Accounts Item ${i + 1}: "${myAccountsLinks[i]}"`);
            }
        });

        const myAccountsData = getMyAccountsFooterData();
        for (const { linkName, expectedUrl } of myAccountsData) {
            await test.step(`Validate "${linkName}" link visibility, clickability, and URL navigation`, async () => {
                await footer.validateFooterLink(linkName,expectedUrl,logger,
                    (actualUrl, expectedUrl) => actualUrl === expectedUrl || actualUrl.includes('customer/account'));
            });
        }
    });
    
    test('TC07 - Validate Newsletter Subscription in Footer Section', async ({ footer, logger }) => {
        await footer.scrollToFooter();
        await test.step('Validate newsletter subscription field is visible in footer', async () => {
            await expect(footer.newsletterContainer).toBeVisible();
            await logger.verify('Newsletter subscription field is visible in the footer');
        });

        await test.step('Validate newsletter subscriber header visible and display text', async () => {
            await expect(footer.newsletterHeading).toBeVisible();
            const headingText = await footer.getNewsletterHeadingText();
            await logger.verify(`Newsletter subscriber header is visible with text: "${headingText}"`);
            expect(headingText.length).toBeGreaterThan(0);
        });

        await test.step('Validate subscriber add email fields have text area and arrow icon to subscribe', async () => {
            await expect(footer.newsletterEmailInput).toBeVisible();
            await logger.verify('Subscriber add email input field is visible');
            await expect(footer.newsletterSubscribeBtn).toBeVisible();
            await logger.verify('Subscribe icon button is visible');
        });
    });

    test('TC08 - Validate Social Media Icons in Footer Section', async ({ footer, page, logger }) => {
        await test.step('verify social media section is visible', async () => {
            await footer.scrollToFooter();
            await expect(footer.socialMediaContainer).toBeVisible();
            await logger.verify('Social media Section is visible in footer');
        });

        // Data-driven validation of all Social Media icons
        const socialMediaData = getSocialMediaFooterData();
        for (const { linkName, expectedUrl } of socialMediaData) {
            await test.step(`Validate "${linkName}" social media icon visibility, clickability, and URL navigation`, async () => {
                await footer.validateSocialMedia(linkName, expectedUrl, logger);
            });
        }
    });

    test('TC09 - Validate App Stores in Footer Section', async ({ footer, page, logger }) => {
        await test.step('Verify App Store section is visible in footer', async () => {
            await footer.scrollToFooter();
            await expect(footer.appStoreContainer).toBeVisible();
            await logger.verify('App Store section is visible in footer section');
        });

        // Data-driven validation of all App Store links from Excel sheet
        const appStoresData = getAppStoresFooterData();
        for (const { linkName, expectedUrl } of appStoresData) {
            await test.step(`Validate "${linkName}" link visibility, clickability, and URL navigation`, async () => {
                await footer.validateAppStore(linkName, expectedUrl, logger);
            });
        }
    });

    test('TC10 - Validate License and Copyright Section in Footer', async ({ footer, logger }) => {
        await footer.scrollToFooter();

        await test.step('Validate License and Copyright section is visible in footer', async () => {
            await expect(footer.licenseCopyrightSection).toBeVisible();
            await logger.verify('License and Copyright section is visible in the footer');
        });

        await test.step('Validate License field is visible in footer', async () => {
            await expect(footer.licenseField).toBeVisible();
            const licenseText = await footer.getLicenseText();
            await logger.verify(`License field is displayed with text: "${licenseText}"`);
            expect(licenseText.length).toBeGreaterThan(0);
        });

        await test.step('Validate Copyright field is visible in footer', async () => {
            await expect(footer.copyrightField).toBeVisible();
            const copyrightText = await footer.getCopyrightText();
            await logger.verify(`Copyright field is visible with text: "${copyrightText}"`);
            expect(copyrightText.length).toBeGreaterThan(0);
        });
    });
});

