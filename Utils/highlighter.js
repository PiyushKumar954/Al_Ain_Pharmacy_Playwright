/**
 * Centralized utility to highlight elements during test execution and report failures.
 */
export async function highlightElement(page, locator, color = '#ff0000') {
    if (!locator) return;
    try {
        const isVisible = await locator.first().isVisible({ timeout: 500 }).catch(() => false);
        if (!isVisible) return;
        await locator.first().evaluate((el, c) => {
            el.style.setProperty('outline', `5px solid ${c}`, 'important');
            el.style.setProperty('background-color', 'rgba(255, 0, 0, 0.4)', 'important');
            el.style.setProperty('box-shadow', `0 0 20px ${c}`, 'important');
            el.style.setProperty('display', 'inline-block', 'important');
            el.style.setProperty('position', 'relative', 'important');
            el.style.setProperty('padding', '3px 8px', 'important');
            el.style.setProperty('border', `2px solid ${c}`, 'important');
            el.style.setProperty('border-radius', '4px', 'important');

            // Attach visual failure badge
            const badgeId = 'playwright-failure-badge';
            let badge = document.getElementById(badgeId);
            if (!badge) {
                badge = document.createElement('span');
                badge.id = badgeId;
                badge.innerText = ' ❌ FAILED HERE ';
                badge.style.cssText = 'background: #ff0000 !important; color: white !important; font-size: 13px !important; font-weight: bold !important; padding: 3px 8px !important; border-radius: 4px !important; margin-left: 10px !important; display: inline-block !important; vertical-align: middle !important; box-shadow: 0 0 10px red !important; z-index: 999999 !important;';
                el.insertAdjacentElement('afterend', badge);
            }

            el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }, color);

        if (page) {
            await page.waitForTimeout(300);
        }
    } catch (err) {
        console.error('Failed to apply element highlight:', err.message);
    }
}

export async function removeHighlight(locator) {
    if (!locator) return;
    try {
        await locator.first().evaluate((el) => {
            el.style.removeProperty('outline');
            el.style.removeProperty('background-color');
            el.style.removeProperty('box-shadow');
            el.style.removeProperty('display');
            el.style.removeProperty('position');
            el.style.removeProperty('padding');
            el.style.removeProperty('border');
            el.style.removeProperty('border-radius');

            const badge = document.getElementById('playwright-failure-badge');
            if (badge) badge.remove();
        });
    } catch {
        // Ignore if detached
    }
}