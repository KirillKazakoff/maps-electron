import { ipcMain } from 'electron';
import { bot, sendReportVessels } from './telegramBot/bot';
import { getDateObj } from './UI/logic/getDate';
import { FormDateT } from './UI/stores/settingsStore';
import { CheckBoxSettingsT } from './utils/types';
import nodeCron from 'node-cron';
import { downloadF16Report } from './xml/f16/downloadF16Report';
import { moveF16 } from './xml/f16/moveF16';
import { sendF16InfoBot } from './xml/f16/sendF16InfoBot';
import { timePromise } from './utils/time';
import { readConfig, settingsLogin } from './xml/fsModule/readConfig';
import { downloadF19Report } from './xml/f19/downloadF19Report';
import { calcARMDateFromNow } from './utils/calcARMDate';
import { parseF19 } from './xml/f19/parseF19';
import { startProcessPA } from './utils/startProcessPA';
import { isDev } from './utils/isDev';
import { downloadF10Report } from './xml/f10/downloadF10Report';

export const addIpcListeners = () => {
    // osm download ssd
    ipcMain.on('downloadSSDDate', (e, date: FormDateT) => {
        readConfig();
        downloadF16Report(date);
    });
    ipcMain.on('sendSettings', (e, checkBox: CheckBoxSettingsT) => {
        readConfig();
        const resetSettings = settingsLogin.find((s) => s.name === checkBox.name);
        if (!resetSettings) return;

        resetSettings.isChecked = checkBox.isChecked;
    });
    ipcMain.on('sendXMLSSD', () => {
        readConfig();
        console.log(settingsLogin);
        const ssd = moveF16();
        sendF16InfoBot(ssd);
    });

    const cbPlanner = async () => {
        readConfig();
        bot.sendAll('Osm reports load started');

        // osm reports load
        const dateNow = getDateObj().fromYearStart();
        await downloadF16Report(dateNow);
        await downloadF19Report(calcARMDateFromNow());
        await downloadF10Report();

        // update md
        await timePromise(50000);
        updateMd();
        await timePromise(250000);
        updateModel();
        await timePromise(160000);
        // sendPdfReport
        sendReportVessels('Модель данных.pdf');
    };
    ipcMain.on('sendManual', () => cbPlanner());

    let taskOsm: nodeCron.ScheduledTask;
    ipcMain.on('sendPlanner', (e, schedule) => {
        bot.sendAll('bot osm load planned on ' + schedule);

        if (taskOsm) taskOsm.stop();
        taskOsm = nodeCron.schedule(schedule, cbPlanner);
    });

    //osm F19
    ipcMain.on('sendF19', () => {
        readConfig();
        downloadF19Report(calcARMDateFromNow());
    });
    ipcMain.on('sendXMLF19', () => {
        readConfig();
        parseF19();
    });

    //osm F10
    ipcMain.on('sendF10', () => {
        readConfig();
        downloadF10Report();
    });

    // update PA
    const updateMd = () => {
        startProcessPA({ filePath: 'updateMd.ps1', log: 'update md ssdDB files' });
    };
    const updateModel = () => {
        startProcessPA({ filePath: 'updateModel.ps1', log: 'update RDO folder' });
    };
    const updateRegister = () => {
        startProcessPA({ filePath: 'updateRegisters.ps1', log: 'update register files' });
    };
    const updateRDO = () => {
        startProcessPA({ filePath: 'moveRdo.ps1', log: 'update RDO folder' });
    };

    ipcMain.on('sendUpdateMd', () => updateMd());
    ipcMain.on('sendUpdateModel', () => updateModel());
    ipcMain.on('sendUpdateRegister', () => updateRegister());
    ipcMain.on('sendUpdateRDO', () => updateRDO());

    let taskRegistersMd: nodeCron.ScheduledTask;
    const plannerPA = async () => {
        bot.sendAll('register md log planner started');
        updateRegister();
        await timePromise(15000);
        updateRDO();
    };

    ipcMain.on('sendPlannerRegisterMd', () => {
        if (taskRegistersMd) taskRegistersMd.stop();

        plannerPA();
        taskRegistersMd = nodeCron.schedule('0 0 */4 * * *', plannerPA);
    });

    ipcMain.handle('getDefaultSettings', () => settingsLogin);
    ipcMain.handle('getDevStatus', () => isDev());
};
