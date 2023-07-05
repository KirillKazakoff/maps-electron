import { Browser } from 'puppeteer';
import { setFunctionsInPageContext } from '../pageLogic/setFunctionsInPageContext';

export const downloadXML = async (browser: Browser, url: string) => {
    try {
        const page = await browser.newPage();
        const functions = setFunctionsInPageContext(page);
        await page.goto(url);
        await new Promise((resolve) => {
            const intervalId = setInterval(async () => {
                const isSpan = await functions.selectSpan();
                if (isSpan) {
                    resolve('ready');
                    clearInterval(intervalId);
                }
            }, 2000);
        });

        const selectorMenu = '#ReportViewer1_ctl05_ctl04_ctl00';
        const selectorXMLOption = 'a[title="XML-файл с данными отчета"]';
        await page.click(selectorMenu);
        await page.click(selectorXMLOption);

        setTimeout(() => page.close(), 15000);
    } catch (e) {
        return;
    }
};
