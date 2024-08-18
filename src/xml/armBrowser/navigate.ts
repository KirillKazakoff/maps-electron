import { Page } from 'puppeteer';

export const navigate = async (page: Page, url: string) => {
    await Promise.all([
        // page.click(selector),
        page.goto(url),
        page.waitForNavigation({ waitUntil: 'load' }),
    ]);
};
