import { ipcMain } from 'electron';
import { bot, sendReport } from '../telegramBot/bot';
import { startProcessPA } from '../powershell/startProcessPA';
import { timePromise } from '../utils/time';
import nodeCron from 'node-cron';

export const setPowerAUIpc = () => {
    const updateMd = () => {
        startProcessPA({ filePath: 'updateMd.ps1', log: 'update md ssdDB' });
    };
    const updateModel = () => {
        startProcessPA({ filePath: 'updateModel.ps1', log: 'update model' });
    };
    const updateRegister = () => {
        startProcessPA({ filePath: 'updateRegisters.ps1', log: 'update register files' });
    };
    const updateRDO = () => {
        startProcessPA({ filePath: 'moveRdo.ps1', log: 'update RDO folder' });
    };
    const updateQuotes = () => {
        startProcessPA({ filePath: 'updateQuotes.ps1', log: 'update Quotes file' });
    };
    const sendReportsTG = async () => {
        await sendReport('vessel', 'Модель данных');
        await sendReport('quotes', 'Квоты и освоение');
        await sendReport('fish', 'Минтай сельдь');
        await sendReport('tech', 'Технический отчет');
    };
    // updateDB
    const updateModelAll = async () => {
        updateMd();
        await timePromise(350000);
        updateModel();
        await timePromise(160000);
        updateQuotes();
        await timePromise(220000);

        sendReportsTG();
    };

    ipcMain.on('sendUpdateMd', () => updateMd());
    ipcMain.on('sendUpdateModel', () => updateModel());
    ipcMain.on('sendUpdateQuotes', () => updateQuotes());
    ipcMain.on('sendUpdateRegister', () => updateRegister());
    ipcMain.on('sendUpdateRDO', () => updateRDO());
    ipcMain.on('sendReportDebug', () => sendReportsTG());
    ipcMain.on('sendUpdateModelAll', () => updateModelAll());

    // planner
    let taskRegistersMd: nodeCron.ScheduledTask;
    const plannerPA = async () => {
        bot.sendLog('register md log planner started');
        updateRegister();
        await timePromise(15000);
        updateRDO();
    };

    ipcMain.on('sendPlannerRegisterMd', () => {
        if (taskRegistersMd) taskRegistersMd.stop();

        plannerPA();
        taskRegistersMd = nodeCron.schedule('0 0 */4 * * *', plannerPA);
    });

    return { updateModelAll, plannerPA, taskRegistersMd };
};

export type PowerIpcT = ReturnType<typeof setPowerAUIpc>;
