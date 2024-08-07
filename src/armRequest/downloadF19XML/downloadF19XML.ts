import { browser } from '../browser';
import { waitReportLoad } from '../downloadXML/waitReportLoad';

export const downloadF19XML = async () => {
    const url =
        'https://mon.cfmc.ru/ReportViewer.aspx?Report=5&IsAdaptive=false&VesselListId=1352447&StartDate=29-07-2024&EndDate=05-08-2024';

    if (!browser.instance) return null;

    let intervalId: NodeJS.Timer;
    try {
        const page = await browser.instance.newPage();
        await page.goto(url);

        await waitReportLoad({ intervalId, browser, page });
    } catch (e) {
        console.log(e);
    }

    return '';
};
