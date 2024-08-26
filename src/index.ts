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
            nodeIntegration: true,
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

    const sendAsync = async () => {
        const sequence = [{ keyCode: 'Alt', modifiers: ['Shift'] }];

        type EntryT = { keyCode: any; modifiers: any[]; type: any };

        async function sendKey(entry: EntryT, delay: number) {
            ['keyDown', 'char', 'keyUp'].forEach(async (type) => {
                entry.type = type;
                mainWindow.webContents.sendInputEvent(entry);

                // Delay
                await new Promise((resolve) => setTimeout(resolve, delay));
            });
        }

        async function sendSequence(sequence: EntryT[], delay: number) {
            for (const entry of sequence) {
                await sendKey(entry, delay);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        await sendSequence(sequence as EntryT[], 200);
    };

    sendAsync();
};

app.on('ready', createWindow);
