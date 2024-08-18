import { Page } from 'puppeteer';
import { BrowserT } from '../browser';
import { setFunctionsInPageContext } from '../pageParse/setFunctionsInPageContext';

type Params = {
    intervalId: NodeJS.Timer;
    browser: BrowserT;
    page: Page;
    watchEl: 'span' | 'input';
};

export const waitReportLoad = async ({ intervalId, browser, page, watchEl }: Params) => {
    const functions = setFunctionsInPageContext(page);

    return new Promise((resolve, reject) => {
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

            const isPageLoaded = await functions.checkPageStatusLoading(watchEl);
            const liError = await functions.checkLiNoValue();

            console.log(liError);
            if (liError) {
                reject(new Error(liError));
            }

            if (isPageLoaded) {
                resolve('ready');
                clearInterval(intervalId);
            }
        }, 2000);
    });
};
