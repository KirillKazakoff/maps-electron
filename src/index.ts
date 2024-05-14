/* eslint-disable prefer-const */
import { app, BrowserWindow, ipcMain } from 'electron';
import { setLoggingTrace } from './utils/log';
import { CheckBoxSettingsT } from './utils/types';
import { getUserName } from './fsModule/fsUtils';
import config from './config.json';
import fs from 'fs';
import { FormDateT } from './UI/stores/settingsStore';
import { downloadSSD } from './xml/downloadSSD';
import { readXmlSSD } from './xml/readXmlSSD';
import { script } from './script';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const configPath = `/Users/${getUserName()}/Library/Mobile Documents/com~apple~CloudDocs/Конспираторы/ОВЭД/БД Производство/0_Аналитика ССД/Конфигурация/config.json`;

console.log(__dirname);

export let settingsLogin: typeof config.settings;

// if (__dirname.includes('username')) {
// settingsLogin = JSON.parse(fs.readFileSync(configPath).toString()).settings;
// script()
// }

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
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
        console.log(settingsLogin);
    });

    ipcMain.handle('getPath', () => getUserName());
    ipcMain.handle('getDefaultSettings', () => settingsLogin);

    // debug requests
    ipcMain.on('sendXMLSSD', () => readXmlSSD());

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    setTimeout(() => mainWindow.showInactive());
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
