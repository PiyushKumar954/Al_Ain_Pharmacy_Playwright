import { expect } from '@playwright/test';

export class Basetest
{
    constructor(page)
    {
        this.page= page;
    }

    async beforeTest()
    {
        console.log('***Before Test Execution***');
        console.log('Navigating to https://alainpharmacy.ae/ ...');
        await this.page.goto('https://alainpharmacy.ae/', { waitUntil: 'domcontentloaded' });
        console.log('Waiting for 10 sec to validate Captch verification on indian server');
        await this.page.waitForTimeout(10000);
        console.log('***Browser Setup Completed & Navigated***');
    }

    async afterTest()
    {
        console.log('***After Test Execution***');
        console.log('***Test Execution Completed***');
    }
}
