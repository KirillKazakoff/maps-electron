import puppeteer from 'puppeteer';
import { browser } from '../armBrowser/browser';
import { settingsLogin } from '../fsModule/readConfig';
import { login } from '../armBrowser/login';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { FormDateT } from '../../UI/stores/settingsStore';
import { bot } from '../../telegramBot/bot';
import { parseF19 } from './parseF19';

export const downloadF19Report = async (date: FormDateT) => {
    // prettier-ignore
    const timers: NodeJS.Timer[] = [];
    const settings = settingsLogin[0];

    browser.instance = await puppeteer.launch({ devtools: true, headless: false });
    await login(settings);

    try {
        // await downloadXML(reportUrl, timers);
        await downloadFile({
            url: `https://mon.cfmc.ru/ReportViewer.aspx?Report=5&IsAdaptive=false&VesselListId=1352447&StartDate=${date.start}&EndDate=${date.end}`,
            docType: 'xml',
            timers,
        });
    } catch (e) {
        if (e.message === 'error_restart') {
            bot.sendSSDLog('F19 Report not downloaded, trying again');
            await browser.clear(timers);
            await downloadF19Report(date);

            return;
        }

        console.error(e.message);
    }

    await browser.clear(timers);

    parseF19();
};