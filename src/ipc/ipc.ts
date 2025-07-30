import { ipcMain } from 'electron';
import { bot } from '../bot/bot';
import nodeCron from 'node-cron';
import { isDev } from '../puppeteer/fsModule/isDev';
import { setPowerAUIpc } from './setPowerAUIpc';
import { setOsmIpc } from './setOsmIpc';

export const addIpcListeners = () => {
    const powerIpc = setPowerAUIpc();
    const osmIpc = setOsmIpc(powerIpc);
    // const cerberIpc = setCerberIpc();

    // send to client
    ipcMain.handle('getDevStatus', () => isDev());

    // start planners on prod
    if (!isDev()) {
        bot.log.bot('xlsx update + osm update planners added');

        osmIpc.taskOsm = nodeCron.schedule('0 30 12 * * *', osmIpc.cbPlanner);
        osmIpc.taskCompany = nodeCron.schedule('0 10 9 * * *', osmIpc.sendF16CompanyPlanner);
        powerIpc.taskRegistersMd = nodeCron.schedule('0 0 */4 * * *', powerIpc.plannerPA);
        powerIpc.taskReestrMonday = nodeCron.schedule('28 12 * * 1', powerIpc.sendReestr);
        powerIpc.taskReestrThursday = nodeCron.schedule('28 12 * * 4', powerIpc.sendReestr);
    }
};
