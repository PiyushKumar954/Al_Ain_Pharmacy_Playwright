import { test, expect } from '../Fixtures/testFixture.js';

async function navigateToLogin(header) {
    await header.clickLogin();
}

test.describe('Login Module Regression Tests', () => {
    test('TC01 - Navigate to Login Page and verify page title', async ({ header, page, logger }) => {
        await navigateToLogin(header);
        await page.waitForLoadState('domcontentloaded');
        const pageTitle = await page.title();
        const expectedTitle = 'Customer Login';
        if (pageTitle.includes(expectedTitle)) {
            await logger.verify(`Pass: Page title "${pageTitle}" matches expected "${expectedTitle}"`);
            expect(pageTitle).toContain(expectedTitle);
        } else {
            await logger.verify(`Fail: Expected page title to contain "${expectedTitle}" but got "${pageTitle}"`);
            throw new Error(`Fail: Expected page title to contain "${expectedTitle}" but got "${pageTitle}"`);
        }
    });

    test('TC02 - Validate Areas Displaying on Login Page', async ({ header, loginPage, logger }) => {
        await navigateToLogin(header);
        await test.step('Verify Breadcrumb area is visible', async () => {
            await loginPage.toBeVisible(loginPage.breadcrumb, 'Breadcrumb area', logger);
        });
        await test.step('Verify Login/Register form is visible', async () => {
            await loginPage.toBeVisible(loginPage.loginRegisterForm, 'Login/Register form', logger);
        });
    });

    test('TC03 - Validate Breadcrumb on Login Page', async ({ header, loginPage, page, logger }) => {
        await navigateToLogin(header);
        await test.step('Verify breadcrumb heading is visible on login page', async () => {
            if (await loginPage.toBeVisible(loginPage.breadcrumbHeading, 'Breadcrumb heading', logger)) {
                const headingText = await loginPage.getBreadcrumbHeadingText();
                await logger.verify(`Breadcrumb heading text: "${headingText}"`);
            }
        });
        await test.step('Verify breadcrumb path is visible on login page', async () => {
            await expect(loginPage.breadcrumbpath).toBeVisible();
            await logger.verify('Breadcrumb Path is showing on Login page');
        });
        await test.step('Verify URL navigations from Login page breadcrumb', async () => {
            await loginPage.clickBreadcrumbHome();
            await page.waitForLoadState('domcontentloaded');
            const expectedUrl = 'https://alainpharmacy.ae/';
            const actualUrl = page.url();
            if (actualUrl === expectedUrl || actualUrl.startsWith(expectedUrl)) {
                await logger.verify(`Pass: Home URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
            } else {
                await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`);
                throw new Error(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`);
            }
            await navigateToLogin(header);
            await page.waitForLoadState('domcontentloaded');
        });
    });

    test('TC04 - Validate Login/Register Form on Login Page', async ({ header, loginPage, logger }) => {
        await navigateToLogin(header);
        await test.step('Verify Sign In or Register header is visible', async () => {
            await loginPage.toBeVisible(loginPage.signInRegisterHeader, 'Sign In or Register header', logger);
        });
        await test.step('Verify "Enter Your Mobile Number to continue" text is visible', async () => {
            await loginPage.toBeVisible(loginPage.enterMobileNumberLabel, '"Enter Your Mobile Number to continue" field label', logger);
        });
        await test.step('Verify enter email/mobile number box is visible', async () => {
            await loginPage.toBeVisible(loginPage.emailOrMobileInput, 'Enter email/mobile number input box', logger);
        });
        await test.step('Verify continue button is visible', async () => {
            await loginPage.toBeVisible(loginPage.continueBtn, 'Continue button', logger);
        });
        await test.step('Verify "Login using Password Instead" is visible', async () => {
            await loginPage.toBeVisible(loginPage.LoginByPassword, '"Login using Password Instead" area', logger);
        });
        await test.step('Verify Remember Me is visible', async () => {
            await loginPage.toBeVisible(loginPage.rememberMeArea, 'Remember Me area', logger);
        });
        await test.step('Verify Forgot Password? is visible', async () => {
            await loginPage.clickLoginUsingPassword();
            await loginPage.toBeVisible(loginPage.forgotPasswordLink, '"Forgot Password?" link', logger);
        });
        await test.step('Verify Password text is visible', async () => {
            await loginPage.toBeVisible(loginPage.PasswordText, '"Password" text', logger);
        });
        await test.step('Verify Enter Password field is visible', async () => {
            await loginPage.toBeVisible(loginPage.PasswordField, '"Enter Password" field', logger);
        });
        await test.step('Verify Sign In button is visible', async () => {
            await loginPage.toBeVisible(loginPage.signinBtn, '"Sign In" button', logger);
        });
        await test.step('Verify powered by reCAPTCHA is visible', async () => {
            await loginPage.toBeVisible(loginPage.recaptchaArea, 'Powered by reCAPTCHA area', logger);
        });
    });

    test('TC05 - Validate Forgot Password Navigation', async ({ header, loginPage, page, logger }) => {
        await navigateToLogin(header);
        await test.step('Click on Forgot Password and verify navigation URL', async () => {
            await loginPage.clickLoginUsingPassword();
            await loginPage.clickForgotPassword();
            await page.waitForLoadState('domcontentloaded');
            const expectedUrl = 'https://alainpharmacy.ae/customer/account/forgotpassword/';
            const actualUrl = page.url();
            if (actualUrl === expectedUrl || actualUrl.startsWith(expectedUrl)) {
                await logger.verify(`Pass: URL "${actualUrl}" matches expected URL "${expectedUrl}"`);
            } else {
                await logger.verify(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`);
                throw new Error(`Fail: Expected URL "${expectedUrl}" but got "${actualUrl}"`);
            }
        });
    });

    test('TC06 - Validate Mandatory Fields on Login/Register Form', async ({ header, loginPage, page, logger }) => {
        await navigateToLogin(header);
        const expectedError = 'This is a required field';

        await test.step('Validate Mandatory Field for Login via OTP', async () => {
            await loginPage.clickContinue();

            const actualMobileError = await loginPage.getMobileRequiredErrorText();
            if (actualMobileError.includes(expectedError)) {
                await logger.verify(`Pass: Mobile Number/Email is a mandatory field with validation message: "${actualMobileError}"`);
                expect.soft(actualMobileError).toContain(expectedError);
            } else {
                await loginPage.highlight(loginPage.mobileerror);
                await logger.verify(`Fail: Expected Mobile Number error to contain "${expectedError}" but got "${actualMobileError}"`, loginPage.mobileerror);
                expect.soft(actualMobileError, `Expected Mobile Number error to contain "${expectedError}" but got "${actualMobileError}"`).toContain(expectedError);
            }
        });

        await test.step('Validate Mandatory Fields for Login via Password', async () => {
            await loginPage.clickLoginUsingPassword();
            await page.waitForTimeout(2000);
            await loginPage.clickSignIn();

            const isEmailVisible = await loginPage.emailError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
            if (isEmailVisible) {
                const actualEmailError = await loginPage.getEmailRequiredErrorText();
                if (actualEmailError.includes(expectedError)) {
                    await logger.verify(`Pass: Mobile Number/Email is a mandatory field with validation message: "${actualEmailError}"`);
                    expect.soft(actualEmailError).toContain(expectedError);
                } else {
                    await loginPage.highlight(loginPage.emailError);
                    await logger.verify(`Fail: Expected Mobile Number error to contain "${expectedError}" but got "${actualEmailError}"`, loginPage.emailError);
                    expect.soft(actualEmailError).toContain(expectedError);
                }
            } else {
                await logger.verify('Fail: Mobile Number/Email "This is a required field." validation message is not visible');
                expect.soft(isEmailVisible, 'Mobile Number/Email validation message is visible').toBeTruthy();
            }
            const isPasswordVisible = await loginPage.passwordRequiredError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
            if (isPasswordVisible) {
                const actualPasswordError = await loginPage.getPasswordRequiredErrorText();
                if (actualPasswordError.includes(expectedError)) {
                    await logger.verify(`Pass: Password is a mandatory field with validation message: "${actualPasswordError}"`);
                    expect.soft(actualPasswordError).toContain(expectedError);
                } else {
                    await loginPage.highlight(loginPage.passwordRequiredError);
                    await logger.verify(`Fail: Expected Password error to contain "${expectedError}" but got "${actualPasswordError}"`, loginPage.passwordRequiredError);
                    expect.soft(actualPasswordError).toContain(expectedError);
                }
            } else {
                await logger.verify('Fail: Password "This is a required field." validation message is not visible');
                expect.soft(isPasswordVisible, 'Password validation message is visible').toBeTruthy();
            }
        });
    });

    test('TC07 - Validate Country Flag and Country Switcher on Login Page', async ({ header, loginPage, page, logger }) => {
        test.setTimeout(120000);
        await navigateToLogin(header);
        await page.waitForLoadState('domcontentloaded');

        await test.step('Verify Country Flag is visible on Login page', async () => {
            await loginPage.toBeVisible(loginPage.countryFlag, 'Country Flag', logger);
        });

        await test.step('Validate default Country displayed on Login page', async () => {
            const defaultFlagTitle = await loginPage.getCountryFlagTitle();
            await logger.verify(`Default Country Flag displayed: "${defaultFlagTitle}"`);
        });

        await test.step('Validate Country Flag switcher functionality', async () => {
            const countryToSelect = 'India';
            await loginPage.clickCountryFlag();
            await loginPage.typeCountryName(countryToSelect);
            const countryOption = loginPage.getCountryOption(countryToSelect);
            const isCountryDisplayed = await countryOption.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
            if (isCountryDisplayed) {
                const countryOptionText = await countryOption.innerText();
                await logger.verify(`Pass: Country "${countryToSelect}" is displaying on the dropdown list: "${countryOptionText.trim()}"`);
            } else {
                await loginPage.highlight(loginPage.countryList);
                await logger.verify(`Fail: Country "${countryToSelect}" is not displaying on the dropdown list`, loginPage.countryList);
                expect(isCountryDisplayed, `Country "${countryToSelect}" should be visible in dropdown list`).toBeTruthy();
            }

            await loginPage.selectCountryOption(countryOption);
            await logger.verify(`Selected "${countryToSelect}" from dropdown list`);
            const updatedFlagTitle = await loginPage.getCountryFlagTitle();
            if (updatedFlagTitle && updatedFlagTitle.toLowerCase().includes(countryToSelect.toLowerCase())) {
                await logger.verify(`Pass: Country flag title updated successfully to "${countryToSelect}"`);
            } else {
                await loginPage.highlight(loginPage.countryFlag);
                await logger.verify(`Fail: Expected Country Flag title to contain "${countryToSelect}" but got "${updatedFlagTitle}"`, loginPage.countryFlag);
                expect(updatedFlagTitle.toLowerCase()).toContain(countryToSelect.toLowerCase());
            }
        });
    });
    test('TC08 - Validate Login via OTP using Mobile Number', async ({ header, loginPage, page, logger }) => {
        test.setTimeout(180000);
        await navigateToLogin(header);
        await page.waitForLoadState('domcontentloaded');
        await loginPage.scrollIntoView(loginPage.loginRegisterForm);
        await page.waitForTimeout(35000);
        await loginPage.clickCountryFlag();
        await loginPage.typeCountryName('India');
        await page.keyboard.press('Enter');
        await loginPage.sendEmailOrMobile('8917634469');
        await loginPage.clickContinue();
        await page.waitForTimeout(60000);
        const isCustomerLoggedIn = await header.customerName.isVisible().catch(() => false);
        if (isCustomerLoggedIn) {
            const customerName = await header.getCustomerName();
            await logger.verify(`Pass: Customer Name "${customerName}" is visible on header`);
            console.log(`Pass: Customer Name: ${customerName}`);
            expect(isCustomerLoggedIn).toBeTruthy();
        } else {
            await loginPage.highlight(header.customerName);
            await logger.verify('Fail: Customer Name is not visible on header', header.customerName);
            expect(isCustomerLoggedIn, 'Customer name should be visible on header').toBeTruthy();
        }
    });
});