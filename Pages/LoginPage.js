import Basepage from "./Basepage.js";

export default class LoginPage extends Basepage
{
    constructor(page)
    {
        super(page);

        this.ContryFlag = page.locator('.iti__flag').first();
        this.IndiaFlag = page.getByRole('option', { name: 'India (भारत)+' });
        this.MobileNo = page.getByRole('textbox', { name: 'Enter Your Mobile Number to' });
        this.LoginByPassword = page.getByRole('link', { name: 'Login using Password Instead' });
        this.uploadPrescriptionAlert = page.getByText('Please log in to Upload Prescription');
    }

    async SelectCountrycode()
    {
        await this.click(this.ContryFlag);
    }

    async getUploadPrescriptionAlertText()
    {
        await this.uploadPrescriptionAlert.waitFor({ state: 'visible', timeout: 10000 });
        const text = await this.getText(this.uploadPrescriptionAlert);
        return text ? text.trim() : '';
    }
}