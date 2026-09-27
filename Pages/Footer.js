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

        // Company Logo & Contact Info (scoped to footerContainer so it doesn't match hidden header links)
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
    async verifyFooterLinkNavigation(linkName, expectedUrl, { openInNewTab = false } = {})
    {
        await this.scrollToFooter();
        const link = this.getFooterLink(linkName);
        const isVisible = await link.isVisible().catch(() => false);
        const isClickable = await this.isClickable(link);

        let actualUrl = '';
        if (openInNewTab) {
            const [newPage] = await Promise.all([
                this.page.waitForEvent('popup', { timeout: 15000 }).catch(() => null),
                link.click()
            ]);
            if (newPage) {
                await newPage.waitForLoadState('domcontentloaded').catch(() => null);
                actualUrl = newPage.url();
                await newPage.close().catch(() => null);
            }
        } else {
            await link.click();
            await this.page.waitForLoadState('domcontentloaded').catch(() => null);
            actualUrl = this.page.url();
            await this.page.goBack().catch(() => null);
        }

        return { isVisible, isClickable, actualUrl };
    }
}