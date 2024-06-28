/* eslint-disable prefer-const */
import { app, BrowserWindow, ipcMain } from 'electron';
import { setLoggingTrace } from './utils/log';
import { CheckBoxSettingsT } from './utils/types';
import config from '../config.json';
import fs from 'fs';
import { FormDateT } from './UI/stores/settingsStore';
import { downloadSSD } from './xml/downloadSSD';
import { readXmlSSD } from './xml/readXmlSSD';
import { getDateObj } from './UI/logic/getDate';
import { bot } from './telegramBot/bot';
import nodeCron from 'node-cron';
import { updateElectronApp } from 'update-electron-app';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// prettier-ignore
const configPath =
    'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';

export let settingsLogin: typeof config.settings;

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    updateElectronApp({ notifyUser: true });
    setLoggingTrace();
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        fullscreen: false,
        show: false,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    settingsLogin = JSON.parse(fs.readFileSync(configPath).toString()).settings;

    ipcMain.on('downloadSSDDate', (e, date: FormDateT) => {
        downloadSSD(date);
    });
    ipcMain.on('sendSettings', (e, checkBox: CheckBoxSettingsT) => {
        const resetSettings = settingsLogin.find((s) => s.name === checkBox.name);
        if (!resetSettings) return;

        resetSettings.isChecked = checkBox.isChecked;
    });
    ipcMain.on('sendXMLSSD', () => readXmlSSD());

    // let task: nodeCron.ScheduledTask;
    const cbPlanner = () => {
        downloadSSD(getDateObj().fromYearStart());
        bot.sendAll('Planner SSD started');
    };
    ipcMain.on('sendManual', () => cbPlanner());
    ipcMain.on('sendPlanner', (e, schedule) => {
        console.log(schedule);
        nodeCron.getTasks().forEach((t) => t.stop());
        nodeCron.schedule(schedule, cbPlanner);
    });

    ipcMain.handle('getDefaultSettings', () => settingsLogin);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    setTimeout(() => mainWindow.showInactive());
};

app.on('ready', createWindow);

app.on('window-all-closed', async () => {
    bot.sendAll('closed');

    await new Promise((res) => {
        setTimeout(() => res('done'), 5000);
    });
    app.quit();
});
