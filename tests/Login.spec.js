import { test, expect } from '../Fixtures/testFixture.js';
import { getLoginData } from '../Utils/dataProvider.js';

async function navigateToLogin(header) {
    if (await header.loginBtn.isVisible().catch(() => false)) {
        await header.loginBtn.click();
    } else {
        await header.page.goto('https://alainpharmacy.ae/customer/account/login/');
    }
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

    test('TC02 - Validate Areas Displaying on Login Page', async ({ header,loginPage, logger }) => {
        await navigateToLogin(header);
        await test.step('Verify Breadcrumb area is visible', async () => {
            await loginPage.toBeVisible(loginPage.breadcrumb, 'Breadcrumb area', logger);
        });
        await test.step('Verify Login/Register form is visible', async () => {
            await loginPage.toBeVisible(loginPage.loginRegisterForm, 'Login/Register form', logger);
        });
    })

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

    test('TC04 - Validate Login/Register Form on Login Page', async ({ header,loginPage, logger }) => {
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

    test('TC05 - Validate Forgot Password Navigation', async ({ header,loginPage, page, logger }) => {
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
        await navigateToLogin(header);
        await page.waitForTimeout(45000);

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

            // d. After selecting, make sure the country flag element title is changed to entered country (India) containing in the title if showing then pass else fail
            const updatedFlagTitle = await loginPage.getCountryFlagTitle();
            if (updatedFlagTitle && updatedFlagTitle.toLowerCase().includes(countryToSelect.toLowerCase())) {
                await logger.verify(`Pass: Country flag title updated successfully to "${countryToSelect}"`);
            } else {
                await loginPage.highlight(loginPage.countryFlag);
                await logger.verify(`Fail: Expected Country Flag title to contain "${countryToSelect}" but got "${updatedFlagTitle}"`, loginPage.countryFlag);
                expect(updatedFlagTitle.toLowerCase()).toContain(countryToSelect.toLowerCase());
            }
        });
    })

    // test('TC08 - Validate Login using Password with Credentials from Excel', async ({ header, loginPage, page, logger }) => {
    //     const loginData = getLoginData();
    //     await logger.verify('Verifying SignIn validation on Login Page with set of credentials');

    //     for (const { email, password, expected } of loginData) {
    //         await test.step(`TC07 Login Validation -> Email: "${email}", Expected: "${expected}"`, async () => {
    //             await navigateToLogin(header);
    //             await page.waitForLoadState('domcontentloaded');

    //             await logger.verify(`Test Data -> Email: "${email}", Password: "${password}", Expected: "${expected}"`);

    //             const loginSucceeded = await loginPage.loginWithCredentials(email, password);

    //             if (expected.toLowerCase() === 'valid') {
    //                 if (loginSucceeded) {
    //                     await logger.verify(`Pass: Valid credentials - Login succeeded for: "${email}"`);
    //                     expect(loginSucceeded).toBeTruthy();
    //                     await loginPage.logout();
    //                 } else {
    //                     const errorMsg = await loginPage.getLoginErrorText();
    //                     await loginPage.highlight(loginPage.loginGlobalError.first());
    //                     await logger.verify(`Fail: Valid credentials failed to log in for "${email}". Error: "${errorMsg}"`, loginPage.loginGlobalError.first());
    //                     expect.soft(loginSucceeded, `Login expected to succeed for: "${email}" but failed with error: "${errorMsg}"`).toBeTruthy();
    //                 }
    //             } else {
    //                 // Invalid credentials expected
    //                 if (!loginSucceeded) {
    //                     const isErrorVisible = await loginPage.isLoginErrorVisible();
    //                     const errorMsg = await loginPage.getLoginErrorText();
    //                     if (isErrorVisible) {
    //                         await logger.verify(`Pass: Invalid credentials - Error displayed as expected: "${errorMsg}"`);
    //                         expect(isErrorVisible).toBeTruthy();
    //                     } else {
    //                         await logger.verify(`Fail: No error shown for invalid credentials: "${email}"`);
    //                         expect.soft(isErrorVisible, `No error shown for invalid credentials: "${email}"`).toBeTruthy();
    //                     }
    //                 } else {
    //                     await logger.verify(`Fail: Invalid credentials unexpectedly succeeded in logging in for: "${email}"`);
    //                     expect.soft(loginSucceeded, `Login expected to fail for invalid credentials: "${email}"`).toBeFalsy();
    //                     await loginPage.logout();
    //                 }
    //             }
    //         });
    //     }
    // });
});