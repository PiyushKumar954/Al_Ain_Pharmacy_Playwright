import { test, expect } from '../Fixtures/testFixture.js';

test.describe('Header Module Regression Tests', () => {
    test.describe.configure({ mode: 'serial' });

    test('TC01 - Validate all Header contents are visible for Guest User', async ({ header, logger }) => {
        await test.step('Verify Top Promo Banner is visible', async () => {
            await expect(header.headerpromoBanner).toBeVisible();
            await logger.verify('Top Promotional Banner is visible and displayed on header');
        });

        await test.step('Verify Website Logo is visible', async () => {
            await expect(header.websitelogo).toBeVisible();
            await logger.verify('Website Logo is visible and displayed correctly');
        });

        await test.step('Verify Search Bar input is visible', async () => {
            await expect(header.searchBar).toBeVisible();
            await logger.verify('Search Bar input is visible on header');
        });

        await test.step('Verify Login Button is visible for guest user', async () => {
            await expect(header.loginBtn).toBeVisible();
            await logger.verify('Login / Account button is visible for guest user');
        });

        await test.step('Verify Wishlist Button is visible', async () => {
            await expect(header.WishlistBtn).toBeVisible();
            await logger.verify('Wishlist button is visible on header');
        });

        await test.step('Verify Cart Button is visible', async () => {
            await expect(header.CartBtn).toBeVisible();
            await logger.verify('Shopping Cart button is visible on header');
        });

        await test.step('Verify Upload Prescription Button is visible', async () => {
            await expect(header.UploadPrescBtn).toBeVisible();
            await logger.verify('Upload Prescription button is visible on header');
        });

        await test.step('Verify Mega Menu navigation bar is visible', async () => {
            await expect(header.MegaMenus).toBeVisible();
            await logger.verify('Mega Menu navigation categories bar is visible');
        });
    });

    test('TC02 - Validate Top Promotion Banner and Displayed Text Content', async ({ header, logger }) => {
        
        await test.step('Verify Promo Banner text is visible and retrieve text content', async () => {
            await expect(header.promoBannertext).toBeVisible();
            
            const displayedText = await header.getText(header.promoBannertext);
            await logger.verify(`Promo banner text is displayed: "${displayedText?.trim()}"`);

            expect(displayedText).toBeTruthy();
            expect(displayedText).toContain('10% Off on Your First Order');
        });
    });

    test('TC03 - Validate Website Logo Clickability and Redirection', async ({ header, page, logger }) => {
        await test.step('Verify Website Logo is clickable', async () => {
            await expect(header.websitelogo).toBeEnabled();
            await logger.verify('Website Logo is clickable (enabled)');
        });

        await test.step('Click Website Logo and verify redirection', async () => {
            await header.clickLogo();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/https:\/\/alainpharmacy\.ae\/?/);
            const currentUrl = page.url();
            await logger.verify(`Website Logo clicked and redirected to Homepage URL: ${currentUrl}`);
        });
    });

    test('TC04 - Validate Search Field, Search Button, and Keyword Search', async ({ header, page, logger }) => {
        const searchKeyword = 'panadole';

        await test.step('Validate Search Text Field visibility, placeholder, and input capability', async () => {
            await expect(header.searchBarText).toBeVisible();
            const placeholder = await header.searchBarText.getAttribute('placeholder');
            await logger.verify(`Search text field is visible with placeholder: "${placeholder}"`);
            expect(placeholder).toBeTruthy();

            await expect(header.searchBarText).toBeEnabled();
            await header.fill(header.searchBarText, searchKeyword);
            await expect(header.searchBarText).toHaveValue(searchKeyword);
            await logger.verify(`Search field is clickable and user added search keyword: "${searchKeyword}"`);
        });

        await test.step('Validate Search Icon Button visibility and clickability', async () => {
            await expect(header.searchBtn).toBeVisible();
            await logger.verify('Search icon button is displayed');

            await expect(header.searchBtn).toBeEnabled();
            await logger.verify('Search icon button is clickable (enabled)');
        });

        await test.step('Click Search Button and verify navigation to Search Results Page', async () => {
            await header.clickSearch();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).toHaveURL(new RegExp(searchKeyword, 'i'));
            const currentUrl = page.url();
            await logger.verify(`Navigated to Search Results page. URL contains "${searchKeyword}": ${currentUrl}`);
        });
    });

    test('TC05 - Validate Login Button Clickability and Redirection to Login Page', async ({ header, page, logger }) => {
        await test.step('Verify Login button in header is clickable', async () => {
            await expect(header.loginBtn).toBeEnabled();
            await logger.verify('Login button in header is visible and clickable ');
        });

        await test.step('Click Login button and verify navigation to Login page', async () => {
            await header.clickLogin();
            await page.waitForLoadState('domcontentloaded');

            const pageTitle = await page.title();
            const expectedTitle = 'Customer Login';
            if (pageTitle.includes(expectedTitle)) {
                await logger.verify(`Pass: Page title "${pageTitle}" matches expected "${expectedTitle}"`);
                expect(pageTitle).toContain(expectedTitle);
            } else {
                throw new Error(`Fail: Expected page title to contain "${expectedTitle}" but got "${pageTitle}"`);
            }
        });
    });

    test('TC06 - Validate Wishlist Button Clickability, Count Badge for Guest User, and Redirection', async ({ header, page, logger }) => {
        await test.step('Verify Wishlist button is clickable in header', async () => {
            await expect(header.WishlistBtn).toBeEnabled();
            await logger.verify('Wishlist button is visible and clickable in header');
        });

        await test.step('Verify Wishlist icon displays product count for Guest User', async () => {
            const wishlistCount = await header.getWishlistCount();
            await logger.verify(`Wishlist product count displayed for guest user: "${wishlistCount}"`);
            expect(wishlistCount).toBe('0');
        });

        await test.step('Click Wishlist button as Guest User and verify redirection', async () => {
            await header.clickWishlist();
            await page.waitForLoadState('domcontentloaded');

            const pageTitle = await page.title();
            const expectedTitle = 'Customer Login';
            if (pageTitle.includes(expectedTitle)) {
                await logger.verify(`Pass: Page title "${pageTitle}" matches expected "${expectedTitle}"`);
                expect(pageTitle).toContain(expectedTitle);
            } else {
                throw new Error(`Fail: Expected page title to contain "${expectedTitle}" but got "${pageTitle}"`);
            }
        });
    });

    test('TC07 - Validate Cart Button Clickability and Redirection', async ({ header, page, logger }) => {
        await test.step('Verify Cart button in header is clickable', async () => {
            await expect(header.CartBtn).toBeEnabled();
            await logger.verify('Cart button is visible and clickable in header');
        });

        await test.step('Click Cart button and verify redirection', async () => {
            await header.clickCart();
            await page.waitForLoadState('domcontentloaded');

            const pageTitle = await page.title();
            const expectedTitle = 'Shopping Cart';
            if (pageTitle.includes(expectedTitle)) {
                await logger.verify(`Pass: Page title "${pageTitle}" matches expected "${expectedTitle}"`);
                expect(pageTitle).toContain(expectedTitle);
            } else {
                throw new Error(`Fail: Expected page title to contain "${expectedTitle}" but got "${pageTitle}"`);
            }
        });
    });

    test('TC08 - Validate Upload Prescription Button Clickability & Redirection', async ({ header, loginPage, page, logger }) => {
        await test.step('Verify Upload Prescription button in header is clickable', async () => {
            await expect(header.UploadPrescBtn).toBeEnabled();
            await logger.verify('Upload Prescription button is visible and clickable in header');
        });

        await test.step('Click Upload Prescription button as guest user and verify redirection', async () => {
            await header.clickUploadPrescription();
            await page.waitForLoadState('domcontentloaded');

            const pageTitle = await page.title();
            const expectedTitle = 'Customer Login';
            if (pageTitle.includes(expectedTitle)) {
                await logger.verify(`Pass: Page title "${pageTitle}" matches expected "${expectedTitle}"`);
                expect(pageTitle).toContain(expectedTitle);
            } else {
                throw new Error(`Fail: Expected page title to contain "${expectedTitle}" but got "${pageTitle}"`);
            }
        });

        await test.step('Verify "Please log in to Upload Prescription" alert message is displayed for Gust User', async () => {
            const expectedAlert = 'Please log in to Upload Prescription';
            const actualAlert = await loginPage.getUploadPrescriptionAlertText();

            if (actualAlert.includes(expectedAlert)) {
                await logger.verify(`Pass: Alert message text "${actualAlert}" matches expected "${expectedAlert}"`);
                expect(actualAlert).toContain(expectedAlert);
            } else {
                throw new Error(`Fail: Expected alert message "${expectedAlert}" but got "${actualAlert}"`);
            }
        });
    });

});