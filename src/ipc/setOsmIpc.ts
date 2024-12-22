import { ipcMain } from 'electron';
import { bot } from '../telegramBot/bot';
import { FormDateT } from '../UI/stores/settingsStore';
import { calcARMDateFromNow, calcARMDateNow } from '../utils/date';
import { timePromise } from '../utils/time';
import { downloadF10Report } from '../puppeteer/f10/downloadF10Report';
import { downloadF16Report } from '../puppeteer/f16/downloadF16Report';
import { moveF16 } from '../puppeteer/f16/moveF16';
import { sendF16InfoBot } from '../puppeteer/f16/sendF16InfoBot';
import { downloadF19Report } from '../puppeteer/f19/downloadF19Report';
import { operateF19 } from '../puppeteer/f19/operateF19';
import { readConfig, vessels } from '../puppeteer/fsModule/readConfig';
import nodeCron from 'node-cron';
import type { PowerIpcT } from './setPowerAUIpc';

export const setOsmIpc = (powerIpc: PowerIpcT) => {
    // F19
    ipcMain.on('sendF19', () => {
        readConfig();
        downloadF19Report(calcARMDateFromNow());
    });
    ipcMain.on('sendXMLF19', () => {
        readConfig();
        operateF19();
    });

    // F16
    ipcMain.on('sendF16', (e, date: FormDateT) => {
        readConfig();
        downloadF16Report(date, [...vessels.main, ...vessels.special]);
    });
    ipcMain.on('sendXMLF16', () => {
        readConfig();
        const ssd = moveF16();
        if (ssd.ssd.length > 0) sendF16InfoBot(ssd);
    });

    const sendF16CompanyPlanner = async () => {
        readConfig();
        const date = calcARMDateFromNow();
        const ssd = await downloadF16Report(date, vessels.company);
        if (!ssd) return;

        sendF16InfoBot(ssd);
    };
    ipcMain.on('sendF16Company', () => {
        sendF16CompanyPlanner();
    });
    // F10
    ipcMain.on('sendF10', () => {
        readConfig();
        downloadF10Report(calcARMDateNow(), false);
    });
    ipcMain.on('sendF10Date', (e, date: FormDateT) => {
        readConfig();
        downloadF10Report(date, true);
    });

    // osmLoad planner
    const cbPlanner = async () => {
        readConfig();
        bot.sendLog('Osm reports load started');

        const date = calcARMDateFromNow();

        await downloadF16Report(date, [...vessels.main, ...vessels.special]);
        await downloadF10Report(calcARMDateNow(), false);
        await downloadF19Report(date);

        await timePromise(100000);
        // update md
        await powerIpc.updateModelAll();
    };
    ipcMain.on('sendManual', () => cbPlanner());

    const returnObj = {
        taskOsm: <nodeCron.ScheduledTask>{},
        taskCompany: <nodeCron.ScheduledTask>{},
        cbPlanner,
        sendF16CompanyPlanner,
    };

    ipcMain.on('sendPlanner', (e, schedule) => {
        bot.sendLog('bot osm load planned on ' + schedule);

        if (returnObj.taskOsm) returnObj.taskOsm.stop();

        returnObj.taskOsm = nodeCron.schedule(schedule, cbPlanner);
    });

    return returnObj;
};
