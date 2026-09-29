import { test, expect } from '../Fixtures/testFixture.js';
import { getFooterLinkItem, getQuicklinkFooterData, getHelpSupportFooterData, getMyAccountsFooterData, getSocialMediaFooterData, getAppStoresFooterData } from '../Utils/dataProvider.js';

test.describe('Footer Module Regression Tests', () => {

    test('TC01 - Validate Footer Container Visibility after Scrolling', async ({ footer, logger }) => {
        await test.step('Scroll to Footer and verify Footer container is visible', async () => {
            await footer.scrollToFooter();
            await footer.toBeVisible(footer.footerContainer, 'Footer container', logger);
        });
    });

    test('TC02 - Validate Top Service and Benefit Section', async ({ footer, logger }) => {
        await footer.scrollToFooter();
        const benefitSections = [
            { name: 'Free Shipping', icon: footer.freeShippingIcon, textLocator: footer.freeShippingText, expectedText: 'Free Shipping' },
            { name: 'Supported 24/7', icon: footer.supported247Icon, textLocator: footer.supported247Text, expectedText: 'Supported 24/7' },
            { name: '100% Payment Secure', icon: footer.paymentSecureIcon, textLocator: footer.paymentSecureText, expectedText: '100% Payment Secure' },
        ];
        for (const { name, icon, textLocator, expectedText } of benefitSections) {
            await test.step(`Verify ${name} section icon and text are displayed`, async () => {
                await footer.toBeVisible(icon, `${name} icon`, logger);
                await footer.toBeVisible(textLocator, `${name} text`, logger);
                const actualText = await footer.getText(textLocator);
                if (actualText.includes(expectedText)) {
                    await logger.verify(`Pass: ${name} text matches expected "${expectedText}"`);
                    expect(actualText).toContain(expectedText);
                } else {
                    await footer.highlight(textLocator);
                    await logger.verify(`Fail: Expected "${expectedText}" but got "${actualText}"`, textLocator);
                    throw new Error(`Fail: Expected "${expectedText}" but got "${actualText}"`);
                }
            });
        }
    });

    test('TC03 - Validate Company Logo and Contact Information', async ({ footer, page, logger }) => {
        await test.step('Verify company logo is displayed and redirection', async () => {
            await footer.scrollToFooter();
            const expectedUrl = 'https://alainpharmacy.ae/';
            await footer.toBeVisible(footer.footerLogo, 'Footer company logo', logger);
            
            await footer.clickFooterLogo();
            await page.waitForLoadState('domcontentloaded');
            const actualUrl = page.url();
            if (actualUrl === expectedUrl) {
                await logger.verify(`Pass: Actual URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
                await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
            } else {
                await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
                await footer.scrollToFooter();
                await footer.highlight(footer.footerLogo);
                await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`, footer.footerLogo);
                expect.soft(actualUrl, `Expected URL "${expectedUrl}" but got "${actualUrl}"`).toContain('alainpharmacy.ae');
            }
        });

        const contactItems = [
            { name: 'Phone number', icon: footer.phoneIcon, text: footer.phoneText },
            { name: 'Email address', icon: footer.emailIcon, text: footer.emailText }
        ];
        for (const { name, icon, text } of contactItems) {
            await test.step(`Verify ${name.toLowerCase()} logo and text are visible and clickable`, async () => {
                await footer.scrollToFooter();
                await footer.toBeVisible(icon, `${name} logo`, logger);
                await footer.toBeVisible(text, `${name} text`, logger);
                const isTextClickable = await footer.isClickable(text);
                if (isTextClickable) {
                    await logger.verify(`${name} text is clickable`);
                } else {
                    await logger.verify(`${name} text is not clickable`);
                }

                const isIconClickable = await footer.isClickable(icon)
                if (isIconClickable) {
                    await logger.verify(`Pass: ${name} logo is clickable`);
                    expect(isIconClickable).toBeTruthy();
                } else {
                    await footer.highlight(icon);
                    await logger.verify(`Fail: ${name} logo is not clickable`, icon);
                    expect.soft(isIconClickable, `Fail: ${name} logo is not clickable`).toBeTruthy();
                }
            });
        }
    });

    test('TC04 - Validate Quick Links in Footer Section', async ({ footer, page, logger }) => {
        await footer.scrollToFooter();
        await test.step('Verify Quick Links section is visible in footer', async () => {
            await footer.toBeVisible(footer.quickLinks, 'Quick Links section', logger);
            await footer.toBeVisible(footer.quickLinksHeading, 'Quick Links heading', logger);
        });

        await test.step('Display and log all item names showing under Quick Links', async () => {
            const quickLinks = await footer.getQuickLinkItems();
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
        await footer.scrollToFooter();
        await test.step('Verify Help & Support section is visible in footer', async () => {
            await footer.toBeVisible(footer.helpSupport, 'Help & Support section', logger);
            await footer.toBeVisible(footer.helpSupportHeading, 'Help & Support heading', logger);
        });

        await test.step('Display and log all item names showing under Help & Support', async () => {
            const helpSupportLinks = await footer.getHelpSupportItems();
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
        await footer.scrollToFooter();
        await test.step('Verify My Accounts section is visible in footer', async () => {
            await footer.toBeVisible(footer.myAccounts, 'My Accounts section', logger);
            await footer.toBeVisible(footer.myAccountsHeading, 'My Accounts heading', logger);
        });

        await test.step('Display and log all item names showing under My Accounts', async () => {
            const myAccountsLinks = await footer.getMyAccountsItems();
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
            await footer.toBeVisible(footer.newsletterContainer, 'Newsletter subscription container', logger);
        });

        await test.step('Validate newsletter subscriber header visible and display text', async () => {
            await footer.toBeVisible(footer.newsletterHeading, 'Newsletter subscriber heading', logger);
            const headingText = await footer.getNewsletterHeadingText();
            await logger.verify(`Newsletter subscriber header is visible with text: "${headingText}"`);
            expect(headingText.length).toBeGreaterThan(0);
        });

        await test.step('Validate subscriber add email fields have text area and arrow icon to subscribe', async () => {
            await footer.toBeVisible(footer.newsletterEmailInput, 'Newsletter email input field', logger);
            await footer.toBeVisible(footer.newsletterSubscribeBtn, 'Newsletter subscribe button', logger);
        });
    });

    test('TC08 - Validate Social Media Icons in Footer Section', async ({ footer, page, logger }) => {
        await footer.scrollToFooter();
        await test.step('verify social media section is visible', async () => {
            await footer.toBeVisible(footer.socialMediaContainer, 'Social media container', logger);
        });

        const socialMediaData = getSocialMediaFooterData();
        for (const { linkName, expectedUrl } of socialMediaData) {
            await test.step(`Validate "${linkName}" social media icon visibility, clickability, and URL navigation`, async () => {
                await footer.validateSocialMedia(linkName, expectedUrl, logger);
            });
        }
    });

    test('TC09 - Validate App Stores in Footer Section', async ({ footer, page, logger }) => {
        await footer.scrollToFooter();
        await test.step('Verify App Store section is visible in footer', async () => {
            await footer.toBeVisible(footer.appStoreContainer, 'App Store container', logger);
        });

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
            await footer.toBeVisible(footer.licenseCopyrightSection, 'License and Copyright section', logger);
        });

        await test.step('Validate License field is visible in footer', async () => {
            await footer.toBeVisible(footer.licenseField, 'License field', logger);
            const licenseText = await footer.getLicenseText();
            await logger.verify(`License field is displayed with text: "${licenseText}"`);
            expect(licenseText.length).toBeGreaterThan(0);
        });

        await test.step('Validate Copyright field is visible in footer', async () => {
            await footer.toBeVisible(footer.copyrightField, 'Copyright field', logger);
            const copyrightText = await footer.getCopyrightText();
            await logger.verify(`Copyright field is visible with text: "${copyrightText}"`);
            expect(copyrightText.length).toBeGreaterThan(0);
        });
    });
});