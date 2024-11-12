import { ipcMain } from 'electron';
import { bot } from '../telegramBot/bot';
import { CheckBoxSettingsT } from '../utils/types';
import nodeCron from 'node-cron';
import { readConfig, settingsLogin } from '../puppeteer/fsModule/readConfig';
import { isDev } from '../puppeteer/fsModule/isDev';
import { setPowerAUIpc } from './setPowerAUIpc';
import { setOsmIpc } from './setOsmIpc';
import { setCerberIpc } from './setCerberIpc';

export const addIpcListeners = () => {
    const powerIpc = setPowerAUIpc();
    const osmIpc = setOsmIpc(powerIpc);
    const cerberIpc = setCerberIpc();

    // set settings
    ipcMain.on('sendSettings', (e, checkBox: CheckBoxSettingsT) => {
        readConfig();
        const resetSettings = settingsLogin.find((s) => s.name === checkBox.name);
        if (!resetSettings) return;

        resetSettings.isChecked = checkBox.isChecked;
    });

    // send to client
    ipcMain.handle('getDefaultSettings', () => settingsLogin);
    ipcMain.handle('getDevStatus', () => isDev());

    // start planners on prod
    if (!isDev()) {
        bot.sendLog('xlsx update + osm update planners added');
        osmIpc.taskOsm = nodeCron.schedule('0 30 12 * * *', osmIpc.cbPlanner);
        powerIpc.taskRegistersMd = nodeCron.schedule('0 0 */4 * * *', powerIpc.plannerPA);
    }
};
