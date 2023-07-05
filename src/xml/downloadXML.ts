import { setFunctionsInPageContext } from '../pageLogic/setFunctionsInPageContext';
import { browser } from '../browser';

export const downloadXML = async (url: string) => {
    let intervalId: NodeJS.Timer;
    try {
        const page = await browser.instance.newPage();
        const functions = setFunctionsInPageContext(page);
        await page.goto(url);
        await new Promise((resolve) => {
            intervalId = setInterval(async () => {
                if (!browser.instance) clearInterval(intervalId);

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
    } catch (e) {
        console.log(browser);
        browser.instance.close();
        return;
    }
};
