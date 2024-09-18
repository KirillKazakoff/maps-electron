import { ipcMain } from 'electron';
import { readConfig } from '../puppeteer/fsModule/readConfig';
import { cerber } from '../puppeteer/cerber/cerber';

export const setCerberIpc = () => {
    ipcMain.on('sendStartCerber', async () => {
        readConfig();
        await cerber();
    });

    // cerber();
    return {};
};
