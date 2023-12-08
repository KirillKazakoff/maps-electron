/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain } from 'electron';
import { setLoggingTrace } from './utils/log';
import { api } from './api/api';
import { CheckBoxSettingsT } from './utils/types';
import { settingsLogin } from './armRequest/settingsLogin';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

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
    mainWindow.showInactive();

    ipcMain.on('downloadSSDLast', () => api.sendSSDLast());
    ipcMain.on('downloadSSDAll', () => api.sendSSDAll());
    ipcMain.on('downloadCoords', () => api.sendCoords());
    ipcMain.on('sendXMLSSD', () => api.sendXMLSSD());
    ipcMain.on('sendSettings', (e, checkBox: CheckBoxSettingsT) => {
        console.log(checkBox);
        const resetSettings = settingsLogin.find((s) => s.name === checkBox.name);
        resetSettings.isChecked = checkBox.isChecked;
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
