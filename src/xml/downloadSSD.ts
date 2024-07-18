import puppeteer from 'puppeteer';
import { browser } from '../armRequest/browser';
import { timePromise } from '../utils/time';
import { FormDateT } from '../UI/stores/settingsStore';
import { downloadXML } from '../armRequest/downloadXML/downloadXML';
import { login } from '../armRequest/login';
import { moveXMLToCloud } from './moveXmlToCloud';
import { settingsLogin } from '../index';
import { bot } from '../telegramBot/bot';
import { SettingsLoginT } from '../utils/types';
import { sendInfoBot } from './sendInfoBot';

export type SettingsLoginCbT = (settings: SettingsLoginT[]) => Promise<any>;

export const downloadSSD = async (date: FormDateT) => {
    const timers: NodeJS.Timer[] = [];

    let vesselsInit: string[] = [];

    for await (const settings of settingsLogin) {
        if (!settings.isChecked) continue;
        console.log(settings.vesselsId);
        vesselsInit = [...settings.vesselsId];

        browser.instance = await puppeteer.launch({ devtools: true, headless: false });
        await login(settings);

        const { vesselsId } = settings;
        let currentId = vesselsId[0];
        console.log(currentId);

        const clearCb = async () => {
            await timePromise(8000);

            timers.forEach((timer) => clearTimeout(timer));
            await browser.instance.close();

            await timePromise(2000);
        };

        for await (const id of vesselsId) {
            try {
                console.log(id);
                currentId = id;
                const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
                await downloadXML(reportUrl, timers);
            } catch (e) {
                if (e.message === 'error_restart') {
                    settings.vesselsId = vesselsId.slice(vesselsId.indexOf(currentId));
                    await clearCb();
                    await downloadSSD(date);

                    return;
                }

                console.error(e.message);
                bot.sendSSDLog('error occur' + e.message + 'on vessel id ' + id);
            }
        }

        await clearCb();
        settings.vesselsId = vesselsInit;
    }

    const ssdArray = moveXMLToCloud();

    console.log('here');
    sendInfoBot(ssdArray);

    bot.sendSSDLog('SSD uploaded successfuly');
};
