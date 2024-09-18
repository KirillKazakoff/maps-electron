import { timePromise } from '../../utils/time';
import { browser } from '../browser';
import { onError } from '../armBrowser/downloadFile/onError';
import { waitReportLoad } from '../armBrowser/downloadFile/waitReportLoad';
import { getConfig } from '../fsModule/readConfig';

type Params = {
    url: string;
    timers: NodeJS.Timeout[];
    dateReport: string;
};

export const f10Browser = async ({ url, dateReport }: Params) => {
    if (!browser.instance) return null;

    let intervalId: NodeJS.Timeout;
    try {
        const page = await browser.instance.newPage();
        await page.goto(url);
        await waitReportLoad({ intervalId, browser, page, watchEl: 'input' });
        const config = getConfig();

        await page.evaluate(
            async ({ config, dateReport }) => {
                // prettier-ignore
                const inputs = {
                    codeVBR: <HTMLInputElement>document.getElementsByName('ReportViewer1$ctl04$ctl09$txtValue')[0],
                    codeQuotes: <HTMLInputElement>document.getElementsByName('ReportViewer1$ctl04$ctl11$txtValue')[0],
                    dateReport: <HTMLInputElement>document.getElementsByName('ReportViewer1$ctl04$ctl03$txtValue')[0],
                };

                inputs.codeVBR.value = config.vbr.join(',');
                inputs.dateReport.value = dateReport;
            },
            { config, dateReport }
        );

        await page.click('#ReportViewer1_ctl04_ctl11_txtValue');
        await timePromise(3000);
        await page.click('#ReportViewer1_ctl04_ctl11_divDropDown_ctl00');
        await timePromise(1000);

        await page.click('#ReportViewer1_ctl04_ctl00');

        return page;
    } catch (e) {
        console.log('first stage error');
        onError(intervalId, e);
        return false;
    }
};
