import { highlightElement, removeHighlight } from "../Utils/highlighter.js";
import { expect } from "@playwright/test";

export default class Basepage
{
    constructor(page, logger = null) {
        this.page = page;
        this.logger = logger;
    }
    setLogger(logger) {
        this.logger = logger;
    }

    async navigateTo(url)
    {
        await this.page.goto(url);
    }

    async click(locator)
    {
        await locator.click();
    }

    async fill(locator, value)
    {
        await locator.fill(value);
    }

    async getText(locator)
    {
        const text = await locator.textContent();
        return text ? text.trim() : '';
    }

    async isVisible(locator)
    {
        return await locator.isVisible();
    }

    async isDisplayed(locator)
    {
        return await locator.isVisible();
    }

    async waitForElement(locator, timeout = 10000)
    {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async getTitle() 
    {
        return await this.page.title();
    }

    async press(locator, key = 'Enter') 
    {
        await locator.press(key);
    }

    async isClickable(locator)
    {
        try {
            const isVisible = await locator.isVisible().catch(() => false);
            const isEnabled = await locator.isEnabled().catch(() => false);
            return isVisible && isEnabled;
        } catch {
            return false;
        }
    }

    async scrollIntoView(locator)
    {
        await locator.scrollIntoViewIfNeeded();
    }

    async highlight(locator, color = '#ff0000')
    {
        await highlightElement(this.page, locator, color);
    }

    async removeHighlight(locator)
    {
        await removeHighlight(locator);
    }

    async toBeVisible(locator, elementName, logger = this.logger) {
        try {
            await expect(locator).toBeVisible();
            await logger.verify(`Pass: ${elementName} is visible`);
            return true;
        } catch (error) {
            await logger.verify(`Fail: ${elementName} is not visible`);
            throw error;
        }
    }
}