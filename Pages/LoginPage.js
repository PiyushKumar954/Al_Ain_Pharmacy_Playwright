import Basepage from "./Basepage.js";

export default class LoginPage extends Basepage
{
    constructor(page, logger = null)
    {
        super(page, logger);
        // Locators for Breadcrumb
        this.breadcrumb = page.locator('div').filter({ hasText: 'Customer Login Home Customer' }).nth(1);
        this.breadcrumbHeading = page.getByRole('heading', { name: 'Customer Login' });
        this.breadcrumbpath = page.getByText('Home Customer Login');
        this.breadcrumbHome = page.getByRole('link', { name: 'Home', description: 'Home' });

        // Locator for Login/Register Form
        this.loginRegisterForm = page.getByText('Sign In or Register Enter');
        this.signInRegisterHeader = page.getByRole('heading', { name: 'Sign In or Register' });
        this.enterMobileNumberLabel = page.getByText('Enter Your Mobile Number to');
        this.emailOrMobileInput = page.getByRole('textbox', { name: 'Enter Your Mobile Number to' });
        this.continueBtn = page.getByRole('button', { name: 'Continue' });
        this.signinBtn = page.getByRole('button', { name: 'Sign In' });
        this.rememberMeArea = page.locator('label').filter({ hasText: 'Remember Me' });
        this.forgotPasswordLink = page.locator('#maincontent').getByText('Forgot Your Password?');
        this.loginWithOtpLink = page.getByRole('link', { name: 'Login with OTP' });
        this.LoginByPassword = page.getByRole('link', { name: 'Login using Password Instead' });
        this.PasswordText = page.locator('#maincontent').getByText('Password', { exact: true });
        this.PasswordField = page.locator('input[name="login[password]"]');
        this.viewPasswordIcon = page.locator('#eye');
        this.recaptchaArea = page.locator('#maincontent iframe[title*="reCAPTCHA"]');

        // Locators for validation errors
        this.emailError = page.locator('#email-error');
        this.passwordRequiredError = page.locator('#pass-error');
        this.mobileerror = page.getByText('Invalid Phone Number');

        // Locators for Country Flag & Switcher
        this.countryFlag = page.locator('.iti__selected-flag');
        this.countryList = page.getByRole('listbox', { name: 'List of countries' });
        this.countryItems = page.locator('.iti__country');
        this.highlightedCountry = page.locator('.iti__country.iti__highlight');
        this.loginError = page.locator('div').filter({ hasText: 'The account sign-in was' }).nth(4);
        this.recaptchaError = page.locator('div').filter({ hasText: 'reCAPTCHA verification failed.' }).nth(4);
    }

    async getBreadcrumbHeadingText() {
        return await this.getText(this.breadcrumbHeading);
    }

    async clickBreadcrumbHome() {
        await this.click(this.breadcrumbHome);
    }

    async clickLoginUsingPassword() {
    await this.click(this.LoginByPassword);
}

    async clickForgotPassword() {
        await this.click(this.forgotPasswordLink);
    }

    async clickContinue() {
        await this.click(this.continueBtn);
    }

    async clickSignIn() {
        await this.click(this.signinBtn);
    }

    async clickViewPassword() {
    await this.click(this.viewPasswordIcon);
}
async sendEmailOrMobile(value) {
    await this.sendKeys(this.emailOrMobileInput, value);
}
async sendPassword(value) {
    await this.sendKeys(this.PasswordField, value);
}

    async getMobileRequiredErrorText() {
        return await this.getText(this.mobileerror);
    }

    async getEmailRequiredErrorText() {
        return await this.getText(this.emailError);
    }

    async getPasswordRequiredErrorText() {
        return await this.getText(this.passwordRequiredError);
    }

    async getRecaptchaErrorText() {
        return await this.getText(this.recaptchaError);
    }

    async getUploadPrescriptionAlertText() {
        await this.uploadPrescriptionAlert.waitFor({ state: 'visible', timeout: 10000 });
        const text = await this.getText(this.uploadPrescriptionAlert);
        return text ? text.trim() : '';
    }

    async getCountryFlagTitle() {
        return await this.countryFlag.getAttribute('title');
    }

    async clickCountryFlag() {
        await this.click(this.countryFlag);
        await this.countryList.waitFor({ state: 'visible', timeout: 5000 });
    }

    async typeCountryName(countryName) {
        await this.page.keyboard.type(countryName, { delay: 100 });
    }

    getCountryOption(countryName = '') {
        if (countryName) {
            return this.highlightedCountry.first();
        }
        return this.highlightedCountry.first();
    }

    async selectCountryOption(countryOption) {
        const target = typeof countryOption === 'string' ? this.getCountryOption(countryOption) : countryOption;
        await target.click();
        await this.countryList.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
    }

    async selectCountry(countryName) {
        await this.clickCountryFlag();
        await this.typeCountryName(countryName);
        await this.selectCountryOption(countryName);
    }

}