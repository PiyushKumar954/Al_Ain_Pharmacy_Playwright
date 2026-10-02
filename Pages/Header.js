import Basepage from "./Basepage.js";

export default class Header extends Basepage
{
    constructor(page, logger = null)
    {
        super(page, logger);
        this.headerpromoBanner = page.locator('div').nth(4);
        this.promoBannertext = page.getByText('10% Off on Your First Order');
        this.websitelogo = page.getByRole('link').first();
        this.searchBar = page.getByText('× Advanced Search search');
        this.searchBarText = page.getByRole('combobox', { name: 'Search here...' });
        this.searchBtn = page.getByRole('button', { name: 'Search' });
        this.loginBtn = page.locator('.header-account');
        this.WishlistBtn = page.getByRole('button', { description: 'Wishlist' });
        this.WishlistCount = page.getByRole('button', { name: '0', description: 'Wishlist' });
        this.CartBtn = page.getByText('Cart Cart');
        this.UploadPrescBtn = page.getByRole('banner').getByRole('link').filter({ hasText: 'Upload' }).first();
        this.MegaMenus = page.locator('[id="store.menu"]');
        this.customerName = page.locator('.customer-name-wrapper .customer-name').filter({ hasText: /\S+/ });
        this.headerSignout = page.getByRole('link', { name: 'Sign Out' });
    }

    async clickLogo() 
    {
        await this.click(this.websitelogo);
    }

    async clickLogin() 
    {
        await this.click(this.loginBtn);
    }

    async clickWishlist() 
    {
        await this.click(this.WishlistBtn);
    }

    async getWishlistCount() 
    {
        const text = await this.WishlistBtn.innerText();
        const match = text.match(/\d+/);
        return match ? match[0] : (text.trim() || '0');
    }

    async clickCart() 
    {
        await this.click(this.CartBtn);
    }

    async clickUploadPrescription() 
    {
        await this.click(this.UploadPrescBtn);
    }

    async clickSearch() 
    {
        await this.click(this.searchBtn);
    }

    async searchProduct(keyword) 
    {
        await this.fill(this.searchBarText, keyword);
        await this.press(this.searchBarText, 'Enter');
    }

    async clickSignout() 
    {
        await this.click(this.headerSignout);
    }

    async isCustomerLoggedIn() 
    {
        return await this.customerName.isVisible();
    }

    async getCustomerName() 
    {
        return await this.getText(this.customerName);
    }
}