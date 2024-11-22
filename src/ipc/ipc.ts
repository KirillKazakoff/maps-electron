import { ipcMain } from 'electron';
import { bot } from '../telegramBot/bot';
import nodeCron from 'node-cron';
import { isDev } from '../puppeteer/fsModule/isDev';
import { setPowerAUIpc } from './setPowerAUIpc';
import { setOsmIpc } from './setOsmIpc';
import { setCerberIpc } from './setCerberIpc';

export const addIpcListeners = () => {
    const powerIpc = setPowerAUIpc();
    const osmIpc = setOsmIpc(powerIpc);
    const cerberIpc = setCerberIpc();

    // send to client
    ipcMain.handle('getDevStatus', () => isDev());

    // start planners on prod
    if (!isDev()) {
        bot.sendLog('xlsx update + osm update planners added');
        osmIpc.taskOsm = nodeCron.schedule('0 30 12 * * *', osmIpc.cbPlanner);
        osmIpc.taskCompany = nodeCron.schedule('0 30 9 * * *', osmIpc.sendF16CompanyPlanner);
        powerIpc.taskRegistersMd = nodeCron.schedule('0 0 */4 * * *', powerIpc.plannerPA);
    }
};
