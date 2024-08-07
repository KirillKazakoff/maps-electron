import puppeteer from 'puppeteer';
import { browser } from '../armRequest/browser';
import { FormDateT } from '../UI/stores/settingsStore';
import { downloadXML } from '../armRequest/downloadXML/downloadXML';
import { login } from '../armRequest/login';
import { moveXMLToCloud } from './moveXmlToCloud';
import { bot } from '../telegramBot/bot';
import { SettingsLoginT } from '../utils/types';
import { sendInfoBot } from './sendInfoBot';
import { settingsLogin } from '../utils/readConfig';

export type SettingsLoginCbT = (settings: SettingsLoginT[]) => Promise<any>;

export const downloadSSD = async (date: FormDateT) => {
    const timers: NodeJS.Timer[] = [];

    console.log(settingsLogin);

    const settings = settingsLogin[0];
    const { vesselsId } = settings;

    browser.instance = await puppeteer.launch({ devtools: true, headless: false });
    await login(settings);

    let currentId = vesselsId[0];
    console.log(currentId);

    for await (const id of vesselsId) {
        try {
            console.log(id);
            currentId = id;
            const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
            await downloadXML(reportUrl, timers);
        } catch (e) {
            if (e.message === 'error_restart') {
                settings.vesselsId = vesselsId.slice(vesselsId.indexOf(currentId));
                await browser.clear(timers);
                await downloadSSD(date);

                return;
            }

            console.error(e.message);
            bot.sendSSDLog('error occur' + e.message + 'on vessel id ' + id);
        }
    }

    await browser.clear(timers);

    const ssdArray = moveXMLToCloud();

    sendInfoBot(ssdArray);
    bot.sendSSDLog('SSD uploaded successfuly');

    // reinitVesselsId on finish load ssd
    settings.vesselsId = [...settingsLogin[2].vesselsId];
};
