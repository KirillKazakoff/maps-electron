import { Page } from 'puppeteer';
import { BrowserT } from '../browser';
import { setFunctionsInPageContext } from '../setFunctionsInPageContext';

type Params = {
    intervalId: NodeJS.Timeout;
    browser: BrowserT;
    page: Page;
};

export const waitCerberLoad = async ({ intervalId, browser, page }: Params) => {
    const functions = setFunctionsInPageContext(page);

    return new Promise((resolve, reject) => {
        console.log('loading');
        let timeWait = 0;

        intervalId = setInterval(async () => {
            timeWait += 2000;

            if (!browser.instance) {
                clearInterval(intervalId);
                return;
            }
            if (timeWait > 400000) {
                clearInterval(intervalId);
                reject(new Error('wait too much'));
            }

            const isPageLoaded = await functions.checkPageStatusLoadingCerber();

            if (isPageLoaded) {
                resolve('ready');
                clearInterval(intervalId);
            }
        });
    });
};
