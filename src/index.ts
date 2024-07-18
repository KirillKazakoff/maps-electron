/* eslint-disable prefer-const */
import { app, BrowserWindow, ipcMain } from 'electron';
import { setLoggingTrace } from './utils/log';
import { CheckBoxSettingsT, ConfigT } from './utils/types';
import fs from 'fs';
import { FormDateT } from './UI/stores/settingsStore';
import { downloadSSD } from './xml/downloadSSD';
import { moveXMLToCloud } from './xml/moveXmlToCloud';
import { getDateObj } from './UI/logic/getDate';
import { bot } from './telegramBot/bot';
import nodeCron from 'node-cron';
import { updateElectronApp } from 'update-electron-app';
import { configUrl } from './fsModule/fsUtils';
import { sendInfoBot } from './xml/sendInfoBot';
import _ from 'lodash';
import child_process from 'child_process';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// prettier-ignore
export let settingsLogin: ConfigT['settings'];

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    // child_process.exec('C:\\RunFlow.ps1', { shell: 'powershell.exe' });

    const dataRows: string[][] = [];

    // console.log(child.stdout);
    // new ExcelJS.Workbook().xlsx
    //     .readFile('C:\\Users\\admin\\iCloudDrive\\example.xlsx')
    //     .then((book) => {
    //         const ws = book.getWorksheet('Sheet');
    //         const table = ws.getTable('Таблица_имена') as any;
    //         const ref = table.table.tableRef;

    //         ws.eachRow((r) => {
    //             const dataRow: string[] = [];

    //             r.eachCell((c) => {
    //                 dataRow.push(c.value.toString());
    //             });
    //             dataRows.push(dataRow);
    //         });

    //         dataRows.shift();
    //         console.log(dataRows);
    //     });

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

    settingsLogin = JSON.parse(fs.readFileSync(configUrl).toString()).settings;

    ipcMain.on('downloadSSDDate', (e, date: FormDateT) => {
        downloadSSD(date);
    });
    ipcMain.on('sendSettings', (e, checkBox: CheckBoxSettingsT) => {
        const resetSettings = settingsLogin.find((s) => s.name === checkBox.name);
        if (!resetSettings) return;

        resetSettings.isChecked = checkBox.isChecked;
    });
    ipcMain.on('sendXMLSSD', () => {
        const ssd = moveXMLToCloud();
        sendInfoBot(ssd);
    });

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
