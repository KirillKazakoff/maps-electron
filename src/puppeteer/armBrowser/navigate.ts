import { Page } from 'puppeteer';

export const navigate = async (page: Page, url: string) => {
    await Promise.all([page.goto(url), page.waitForNavigation({ waitUntil: 'load' })]);
};
