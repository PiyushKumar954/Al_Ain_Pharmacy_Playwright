import { highlightElement } from './highlighter.js';

export class Logger {
    constructor(page = null, testInfo = null) {
        this.page = page;
        this.testInfo = testInfo;
    }

    setPage(page) {
        this.page = page;
    }

    setTestInfo(testInfo) {
        this.testInfo = testInfo;
    }

    async verify(message, locator = null) {
        const time = new Date().toLocaleTimeString();
        const isFail = message.toLowerCase().startsWith('fail') || message.includes('Fail:');
        const icon = isFail ? '❌' : '✔';
        const logMsg = `[${time}] ${icon} [${isFail ? 'FAILED' : 'VERIFIED'}]: ${message}`;
        
        console.log(logMsg);

        if (this.testInfo) {
            await this.testInfo.attach('Verification Details', {
                body: logMsg,
                contentType: 'text/plain'
            });

            // On failure, highlight failing element and capture screenshot into Allure report
            if (isFail && this.page) {
                try {
                    await this.page.bringToFront().catch(() => null);

                    if (locator) {
                        await highlightElement(this.page, locator);
                    }

                    const screenshot = await this.page.screenshot({ fullPage: false });
                    await this.testInfo.attach(`Failure Screenshot - ${message.slice(0, 50)}`, {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                } catch (err) {
                    console.error('Failed to capture failure screenshot in Logger:', err.message);
                }
            }
        }
    }

    async info(message) {
        const time = new Date().toLocaleTimeString();
        const logMsg = `[${time}] ℹ️ [INFO]: ${message}`;
        console.log(logMsg);
        if (this.testInfo) {
            await this.testInfo.attach('Info Details', {
                body: logMsg,
                contentType: 'text/plain'
            });
        }
    }

    async pass(message) {
        await this.verify(`Pass: ${message}`);
    }

    async fail(message, locator = null) {
        await this.verify(`Fail: ${message}`, locator);
    }
}

export default Logger;