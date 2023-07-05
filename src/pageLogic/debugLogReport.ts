import puppeteer from 'puppeteer';
import reportJson from '../xml/filesDebug/report.json';
import { ReportT } from '../xml/parseReportSSD/parseReportSSD';

export const debugLogReport = async () => {
    const browser = await puppeteer.launch({ devtools: true, headless: false });
    const page = await browser.newPage();

    await page.goto('https://kirillkazakoff.github.io/Portfolio/');

    await page.evaluate((report: ReportT) => {
        // console.log(report);
    }, reportJson);
};
