import { ipcMain } from 'electron';
import { bot, sendReport } from '../telegramBot/bot';
import { startProcessPA } from '../powershell/startProcessPA';
import { timePromise } from '../utils/time';
import nodeCron from 'node-cron';

export const setPowerAUIpc = () => {
    const updateMd = () =>
        startProcessPA({ filePath: 'updateMd.ps1', log: 'update md ssdDB' });
    const updateModel = () =>
        startProcessPA({ filePath: 'updateModel.ps1', log: 'update model' });
    const updateRegister = () =>
        startProcessPA({ filePath: 'updateRegisters.ps1', log: 'update register files' });
    const updateRDO = () =>
        startProcessPA({ filePath: 'moveRdo.ps1', log: 'update RDO folder' });
    const updateQuotes = () =>
        startProcessPA({ filePath: 'updateQuotes.ps1', log: 'update Quotes file' });
    const updateF19QueryReport = () =>
        startProcessPA({ filePath: 'updateF19QuerryReport.ps1', log: 'update Query report' });

    const sendReportsTG = async () => {
        await sendReport('vessel', 'Модель данных', 'pdf');
        await sendReport('tech', 'Технический отчет', 'pdf');
        await sendReport('crab', 'Выпуск краба за сутки', 'pdf');
        await sendReport('f19Querry', '2025 Вылов выпуск', 'xlsx');
        // await sendReport('quotes', 'Квоты и освоение');
        // await sendReport('fish', 'Минтай сельдь');
    };
    // updateDB
    const updateModelAll = async () => {
        updateMd();
        await timePromise(385000);
        updateModel();
        await timePromise(160000);
        updateF19QueryReport();
        await timePromise(320000);
        // updateQuotes();
        // await timePromise(550000);

        await sendReportsTG();
    };

    ipcMain.on('sendUpdateMd', () => updateMd());
    ipcMain.on('sendUpdateModel', () => updateModel());
    ipcMain.on('sendUpdateQuotes', () => updateQuotes());
    ipcMain.on('sendUpdateRegister', () => updateRegister());
    ipcMain.on('sendUpdateRDO', () => updateRDO());
    ipcMain.on('sendReportDebug', () => sendReportsTG());
    ipcMain.on('sendUpdateModelAll', () => updateModelAll());
    ipcMain.on('sendUpdateF19QuerryReport', () => updateF19QueryReport());

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
