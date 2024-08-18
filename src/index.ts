import { app, BrowserWindow } from 'electron';
import { setLoggingTrace } from './utils/log';
import { updateElectronApp } from 'update-electron-app';
import { addIpcListeners } from './ipc';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// prettier-ignore
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    updateElectronApp({ notifyUser: true });
    setLoggingTrace();
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        fullscreen: false,
        show: false,
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    addIpcListeners();

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    setTimeout(() => mainWindow.showInactive());
};

app.on('ready', createWindow);
