import { expect } from '@playwright/test';
import Basepage from "./Basepage.js";

export default class Footer extends Basepage
{
    constructor(page)
    {
        super(page);

        this.footerContainer = page.locator('footer, .page-footer, .footer').first();

        // Top Service & Benefit Section
        this.freeShippingText = page.getByRole('heading', { name: 'Free Shipping' });
        this.freeShippingIcon = page.locator('.lazyload.as-footer-top-img').first();
        this.supported247Text = page.getByRole('heading', { name: 'Supported 24/' });
        this.supported247Icon = page.locator('div:nth-child(2) > div > .lazyload');
        this.paymentSecureText = page.getByRole('heading', { name: '% Payment Secure' });
        this.paymentSecureIcon = page.locator('div:nth-child(3) > div > .lazyload');

        // Company Logo & Contact Info
        this.footerLogo = page.locator('.tollfree-wrap > a');
        this.phoneIcon = this.footerContainer.getByRole('link').filter({ hasText: /^$/ }).first();
        this.phoneText = this.footerContainer.getByRole('heading', { name: '+971' });
        this.emailIcon = this.footerContainer.getByRole('link').filter({ hasText: /^$/ }).nth(1);
        this.emailText = this.footerContainer.getByRole('heading', { name: 'care@alain-pharmacy.com' });
        
        // Quick Links Section
        this.quickLinks = page.getByText('Quick Links About Us Health');
        this.quickLinksHeading = page.getByRole('heading', { name: 'Quick Links' });
        this.quickLinksContainer = page.getByText('About Us Health Guide Store');

        // Help & Support Section
        this.helpSupport = page.getByText('Help & Support Contact Us');
        this.helpSupportHeading = page.getByRole('heading', { name: 'Help & Support' });
        this.helpSupportContainer = page.getByText('Contact Us FAQs Terms and');

        // My Accounts Section
        this.myAccounts = page.getByText('My Accounts Login / Register');
        this.myAccountsHeading = page.getByRole('heading', { name: 'My Accounts' });
        this.myAccountsContainer = page.getByText('Login / Register View Cart My');

        // Newsletter Subscription Section
        this.newsletterHeading = page.getByRole('heading', { name: 'Subscribe to Newsletter' });
        this.newsletterContainer = page.locator('div').filter({ hasText: 'Subscribe to Newsletter' }).nth(3);
        this.newsletterEmailInput = page.getByRole('textbox', { name: 'Enter Email Address' });
        this.newsletterSubscribeBtn = page.getByRole('button', { name: 'Subscribe' });

        // Social Media Section
        this.socialMediaContainer = page.locator('.media-icon-wrap');
        this.MediaLinkdin = page.locator('.media-icons > a:nth-child(1)');
        this.MediaTwitter = page.locator('.media-icons > a:nth-child(2)');
        this.MediaFacebook = page.locator('.media-icons > a:nth-child(3)');
        this.MediaInstagram = page.locator('.media-icons > a:nth-child(4)');

        // App Stores Section
        this.appStoreContainer = page.locator('.apps-wrap');
        this.appStoreBtn = page.locator('.apps-wrap > a').first();
        this.playStoreBtn = page.locator('.apps-wrap > a:nth-child(2)');

        // License & Copyright Section
        this.licenseCopyrightSection = page.getByText('MOHAP License No : GHF5MONT-260624. Copyright © 2024 Alain Pharmacy. All rights');
        this.licenseField = page.getByRole('heading', { name: 'MOHAP License No : GHF5MONT-' });
        this.copyrightField = page.getByRole('heading', { name: 'Copyright © 2024 Alain' });
    }

    async scrollToFooter()
    {
        await this.scrollIntoView(this.footerContainer);
    }

    async getFreeShippingText()
    {
        return await this.getText(this.freeShippingText);
    }

    async getSupported247Text()
    {
        return await this.getText(this.supported247Text);
    }

    async getPaymentSecureText()
    {
        return await this.getText(this.paymentSecureText);
    }

    async clickFooterLogo()
    {
        await this.click(this.footerLogo);
    }

    async clickPhone()
    {
        await this.click(this.phoneIcon);
    }

    async clickEmail()
    {
        await this.click(this.emailIcon);
    }

    async getPhoneText()
    {
        return await this.getText(this.phoneText);
    }

    async getEmailText()
    {
        return await this.getText(this.emailText);
    }

    getFooterLink(linkText)
    {
        return this.footerContainer.getByRole('link', { name: linkText }).first();
    }

    async isFooterLinkVisible(linkText)
    {
        await this.scrollToFooter();
        return await this.getFooterLink(linkText).isVisible();
    }

    async clickFooterLink(linkText)
    {
        await this.scrollToFooter();
        await this.getFooterLink(linkText).click();
    }

    async getFooterLinkHref(linkText)
    {
        const link = this.getFooterLink(linkText);
        return await link.getAttribute('href');
    }

    async getFooterSectionItems(sectionLocator)
    {
        await this.scrollToFooter();
        const locator = typeof sectionLocator === 'string' ? this.page.getByText(sectionLocator) : sectionLocator;
        let links = locator.locator('a');
        if (await links.count() === 0) {
            links = locator.locator('xpath=following-sibling::*//a | ..//a');
        }
        const texts = await links.allInnerTexts();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async getQuickLinkItems()
    {
        return await this.getFooterSectionItems(this.quickLinksContainer);
    }

    async getHelpSupportItems()
    {
        return await this.getFooterSectionItems(this.helpSupportContainer);
    }

    async getMyAccountsItems()
    {
        return await this.getFooterSectionItems(this.myAccountsContainer);
    }

    async getNewsletterHeadingText()
    {
        return await this.getText(this.newsletterHeading);
    }

    async getLicenseText()
    {
        return await this.getText(this.licenseField);
    }

    async getCopyrightText()
    {
        return await this.getText(this.copyrightField);
    }

    async validateFooterLink(linkName, expectedUrl, logger, options = {})
    {
        await this.scrollToFooter();
        const link = this.getFooterLink(linkName);

        await expect(link).toBeVisible();
        if (logger) await logger.verify(`"${linkName}" link is visible in footer`);
        const isClickable = await this.isClickable(link);
        if (logger) await logger.verify(`"${linkName}" link is clickable`);
        expect(isClickable).toBeTruthy();

        const target = await link.getAttribute('target').catch(() => null);
        const opensInNewTab = target === '_blank';
        let actualUrl = '';
        if (opensInNewTab) {
            const [newPage] = await Promise.all([this.page.waitForEvent('popup'), link.click()]);
            await newPage.waitForLoadState('domcontentloaded').catch(() => {});
            actualUrl = newPage.url();
            await newPage.close();
        } else {
            await link.click();
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            actualUrl = this.page.url();
            await this.page.goBack().catch(() => {});
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
        }

        const normalize = (u) => (u || '').replace(/\/$/, '').toLowerCase();
        let isMatch = normalize(actualUrl) === normalize(expectedUrl) ||
                        normalize(actualUrl).includes(normalize(expectedUrl)) ||
                        (expectedUrl && normalize(expectedUrl).includes(normalize(actualUrl)));

        if (typeof options === 'function' && options(actualUrl, expectedUrl)) {
            isMatch = true;
        } else if (typeof options === 'string' && actualUrl.includes(options)) {
            isMatch = true;
        } else if (options && typeof options === 'object') {
            if (options.additionalAllowedUrl && actualUrl.includes(options.additionalAllowedUrl)) {
                isMatch = true;
            }
            if (typeof options.urlMatcher === 'function' && options.urlMatcher(actualUrl, expectedUrl)) {
                isMatch = true;
            }
        }

        if (isMatch) {
            if (logger) await logger.verify(`Pass: Actual URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
            expect(actualUrl).toBeTruthy();
        } else {
            if (logger) await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`, link);
            expect.soft(normalize(actualUrl), `Expected URL "${expectedUrl}" but got "${actualUrl}"`).toBe(normalize(expectedUrl));
        }

        return { actualUrl, isMatch };
    }

    async validateSocialMedia(linkName, expectedUrl, logger)
    {
        await this.scrollToFooter();
        const iconLocatorMap = {
            'linkedin': this.MediaLinkdin,'twitter': this.MediaTwitter,
            'facebook': this.MediaFacebook,'instagram': this.MediaInstagram
        };
        const locator = iconLocatorMap[(linkName || '').toLowerCase()] || this.MediaLinkdin;

        await expect(locator).toBeVisible();
        if (logger) await logger.verify(`"${linkName}" social media icon is visible in footer`);

        const isClickable = await this.isClickable(locator);
        if (logger) await logger.verify(`"${linkName}" social media icon is clickable`);
        expect(isClickable).toBeTruthy();

        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            locator.click()
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        const actualUrl = newPage.url();
        await newPage.close();

        const normalize = (u) => (u || '').replace(/\/$/, '').toLowerCase();
        const isMatch = normalize(actualUrl) === normalize(expectedUrl) ||
                        normalize(actualUrl).includes(normalize(expectedUrl)) ||
                        (expectedUrl && normalize(expectedUrl).includes(normalize(actualUrl))) ||
                        ((actualUrl.includes('x.com') || actualUrl.includes('twitter.com')) && (expectedUrl.includes('x.com') || expectedUrl.includes('twitter.com')));

        if (isMatch) {
            await logger.verify(`Pass: Actual URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
            expect(actualUrl).toBeTruthy();
        } else {
            await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`, locator);
            expect.soft(normalize(actualUrl)).toBe(normalize(expectedUrl));
        }

        return { actualUrl, isMatch };
    }

    async validateAppStore(linkName, expectedUrl, logger)
    {
        await this.scrollToFooter();
        const map = {
            'app store': this.appStoreBtn,'play store': this.playStoreBtn,
        };
        const key = (linkName || '').toLowerCase().trim();
        const locator = map[key] || (key.includes('play') ? this.playStoreBtn : this.appStoreBtn);

        await expect(locator).toBeVisible();
        if (logger) await logger.verify(`"${linkName}" button is visible in footer`);

        const isClickable = await this.isClickable(locator);
        if (logger) await logger.verify(`"${linkName}" button is clickable`);
        expect(isClickable).toBeTruthy();

        const target = await locator.getAttribute('target').catch(() => null);
        const opensInNewTab = target === '_blank';
        let actualUrl = '';
        if (opensInNewTab) {
            const popupPromise = this.page.waitForEvent('popup', { timeout: 8000 }).catch(() => null);
            await locator.click();
            const newPage = await popupPromise;
            if (newPage) {
                await newPage.waitForLoadState('domcontentloaded').catch(() => {});
                actualUrl = newPage.url();
                await newPage.close();
            } else {
                await this.page.waitForLoadState('domcontentloaded').catch(() => {});
                actualUrl = this.page.url();
                await this.page.goBack().catch(() => {});
                await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            }
        } else {
            await locator.click();
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            actualUrl = this.page.url();
            await this.page.goBack().catch(() => {});
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
        }

        const normalize = (u) => (u || '').replace(/\/$/, '').toLowerCase();
        const normActual = normalize(actualUrl);
        const normExpected = normalize(expectedUrl);

        const isMatch = normActual === normExpected ||
                        normActual.includes(normExpected) ||
                        (normExpected && normExpected.includes(normActual)) ||
                        (normExpected.includes('apple.com') && normActual.includes('apple.com') && (normActual.includes('6474293110') || normActual.includes('al-ain-pharmacy'))) ||
                        (normExpected.includes('play.google.com') && normActual.includes('com.alainpharmacy'));

        if (isMatch) {
            if (logger) await logger.verify(`Pass: Actual URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
            expect(actualUrl).toBeTruthy();
        } else {
            if (logger) await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`, locator);
            expect.soft(normalize(actualUrl)).toBe(normalize(expectedUrl));
        }

        return { actualUrl, isMatch };
    }
}