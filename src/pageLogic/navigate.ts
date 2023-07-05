import { Page } from 'puppeteer';

export const navigate = async (page: Page, selector: string) => {
    await Promise.all([
        page.click(selector),
        page.waitForNavigation({ waitUntil: 'load' }),
    ]);
};
