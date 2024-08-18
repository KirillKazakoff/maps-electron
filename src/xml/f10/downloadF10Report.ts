import puppeteer from 'puppeteer';
import { browser } from '../armBrowser/browser';
import { login } from '../armBrowser/login';
import { settingsLogin } from '../fsModule/readConfig';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { bot } from '../../telegramBot/bot';
import { f10Browser } from './f10Browser';
import { moveF10 } from './moveF10';

export const downloadF10Report = async () => {
    const timers: NodeJS.Timer[] = [];
    const settings = settingsLogin[0];

    browser.instance = await puppeteer.launch({ devtools: true, headless: false });
    await login(settings);

    try {
        const page = await f10Browser({
            url: 'https://mon.cfmc.ru/ReportViewer.aspx?Report=28&IsAdaptive=false&OwnerListId=116124&Date=08-08-2024',
            timers,
        });
        if (!page) throw new Error('error_restart');

        await downloadFile({
            docType: 'xlsx',
            timers,
            page,
        });
    } catch (e) {
        if (e.message === 'error_restart') {
            bot.sendSSDLog('F10 Report not downloaded, trying again');
            await browser.clear(timers);
            await downloadF10Report();

            return;
        }
    }

    await browser.clear(timers);

    moveF10();
};
