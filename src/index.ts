import { app, BrowserWindow } from 'electron';
import { setLoggingTrace } from './utils/log';
import { updateElectronApp } from 'update-electron-app';
import { addIpcListeners } from './ipc/ipc';
import { addMailListener } from './nodeMailer/addMailListener';
import { botMail } from './bot/botMail';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// prettier-ignore
if (require('electron-squirrel-startup')) {
    app.quit();
}

export const createWindow = (): void => {
    updateElectronApp({ notifyUser: true });
    setLoggingTrace();

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        fullscreen: false,
        show: false,
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    addIpcListeners();
    // addMailListener();
    // botMail();

    setTimeout(() => mainWindow.showInactive());
    mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);
