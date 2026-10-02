import { expect } from '@playwright/test';

export class Basetest
{
    constructor(page)
    {
        this.page = page;
    }

    async beforeTest()
    {
        const baseUrl = process.env.BASE_URL || 'https://alainpharmacy.ae/';
        console.log('***Before Test Execution***');
        console.log(`Navigating to ${baseUrl} ...`);
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        console.log('Waiting for 10 sec to validate Captcha verification on indian server');
        await this.page.waitForTimeout(10000);
        console.log('***Browser Setup Completed & Navigated***');
    }

    async afterTest()
    {
        console.log('***After Test Execution***');
        console.log('***Test Execution Completed***');
    }
}