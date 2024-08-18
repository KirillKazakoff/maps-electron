import { Page } from 'puppeteer';
import { browser } from '../browser';
import { onError } from './onError';
import { waitReportLoad } from './waitReportLoad';
import { timePromise } from '../../../utils/time';

type Params = {
    url?: string;
    timers: NodeJS.Timer[];
    docType: 'xml' | 'xlsx';
    page?: Page;
};

export const downloadFile = async ({ url, timers, docType, page: pg }: Params) => {
    if (!browser.instance) return null;

    let intervalId: NodeJS.Timer;
    try {
        let page = pg;

        if (!page) {
            page = await browser.instance.newPage();
            await page.goto(url);
        }

        await waitReportLoad({ intervalId, browser, page, watchEl: 'span' });

        console.log('WAIT DONE');

        // await timePromise(100000);
        const selectorMenu = '#ReportViewer1_ctl05_ctl04_ctl00';
        const selectorXMLOption =
            docType === 'xml' ? 'a[title="XML-файл с данными отчета"]' : 'a[title="Excel"]';
        await page.click(selectorMenu);
        await page.click(selectorXMLOption);

        if (docType === 'xlsx') {
            await timePromise(45000);
        }

        timers.push(setTimeout(() => page.close(), 20000));
    } catch (e) {
        console.log('download error');
        onError(intervalId, e);
        return false;
    }
};