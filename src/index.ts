import { app, BrowserWindow, ipcMain } from 'electron';
import { setLoggingTrace } from './utils/log';
import { api } from './api/api';
import { CheckBoxSettingsT } from './utils/types';
import { getUserName } from './fsModule/getUserName';
import config from './config.json';
import fs from 'fs';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const configPath = `/Users/${getUserName()}/Library/Mobile Documents/com~apple~CloudDocs/Конспираторы/ОВЭД/БД Производство/0_Аналитика ССД/Конфигурация/config.json`;

export let settingsLogin: typeof config.settings;

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
        // focusable: false,
        show: false,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    settingsLogin = JSON.parse(fs.readFileSync(configPath).toString()).settings;

    ipcMain.on('sendXMLSSD', () => api.sendXMLSSD());
    ipcMain.on('downloadSSDLast', () => api.downloadSSDSingle());
    ipcMain.on('downloadSSDAll', () => api.downloadSSDAll());
    ipcMain.on('downloadSSDFromMonth', () => api.downloadSSDFromMonth());

    ipcMain.on('sendSettings', (e, checkBox: CheckBoxSettingsT) => {
        const resetSettings = settingsLogin.find((s) => s.name === checkBox.name);
        resetSettings.isChecked = checkBox.isChecked;
        console.log(settingsLogin);
    });

    ipcMain.on('downloadCoords', () => api.sendDownloadCoords());
    ipcMain.handle('getPath', () => getUserName());

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    setTimeout(() => mainWindow.showInactive());
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
