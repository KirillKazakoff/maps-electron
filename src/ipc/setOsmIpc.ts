import { ipcMain } from 'electron';
import { bot } from '../telegramBot/bot';
import { getDateObj } from '../UI/logic/getDate';
import { FormDateT } from '../UI/stores/settingsStore';
import { calcARMDateFromNow, calcARMDateNow } from '../utils/date';
import { timePromise } from '../utils/time';
import { downloadF10Report } from '../puppeteer/f10/downloadF10Report';
import { downloadF16Report } from '../puppeteer/f16/downloadF16Report';
import { moveF16 } from '../puppeteer/f16/moveF16';
import { sendF16InfoBot } from '../puppeteer/f16/sendF16InfoBot';
import { downloadF19Report } from '../puppeteer/f19/downloadF19Report';
import { operateF19 } from '../puppeteer/f19/operateF19';
import { readConfig, settingsLogin } from '../puppeteer/fsModule/readConfig';
import nodeCron from 'node-cron';
import type { PowerIpcT } from './setPowerAUIpc';

export const setOsmIpc = (powerIpc: PowerIpcT) => {
    // F16
    ipcMain.on('downloadSSDDate', (e, date: FormDateT) => {
        readConfig();
        downloadF16Report(date);
    });
    ipcMain.on('sendXMLSSD', () => {
        readConfig();
        console.log(settingsLogin);
        const ssd = moveF16();
        sendF16InfoBot(ssd);
    });

    // F19
    ipcMain.on('sendF19', () => {
        readConfig();
        downloadF19Report(calcARMDateFromNow());
    });
    ipcMain.on('sendXMLF19', () => {
        readConfig();
        operateF19();
    });

    // F10
    ipcMain.on('sendF10', () => {
        readConfig();
        downloadF10Report(calcARMDateNow(), false);
    });
    ipcMain.on('downloadF10Date', (e, date: FormDateT) => {
        console.log(date);
        readConfig();
        downloadF10Report(date, true);
    });

    // planner
    const cbPlanner = async () => {
        readConfig();
        bot.sendLog('Osm reports load started');

        // osm reports load
        const dateNowFromYear = getDateObj().fromYearStart();
        const dateNow = calcARMDateNow();

        await downloadF16Report(dateNowFromYear);
        await downloadF19Report(dateNow);
        await downloadF10Report(dateNow, false);

        await timePromise(50000);
        // update md
        await powerIpc.updateModelAll();
    };
    ipcMain.on('sendManual', () => cbPlanner());

    // debugNodePlanner
    const returnObj = {
        taskOsm: <nodeCron.ScheduledTask>{},
        cbPlanner,
    };

    ipcMain.on('sendPlanner', (e, schedule) => {
        bot.sendLog('bot osm load planned on ' + schedule);

        if (returnObj.taskOsm) returnObj.taskOsm.stop();

        returnObj.taskOsm = nodeCron.schedule(schedule, cbPlanner);
    });

    return returnObj;
};
