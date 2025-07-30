import { ipcMain } from 'electron';
import { bot } from '../bot/bot';
import { startProcessPA } from '../powershell/startProcessPA';
import { timePromise } from '../utils/time';
import nodeCron from 'node-cron';
import { updateRDO } from '../powershell/updateRDO';
import {
    sendUnsignedReestr,
    sendUnsignedReestrExport,
} from '../powershell/sendUnsignedReestr';

export const setPowerAUIpc = () => {
    const updateMd = () =>
        startProcessPA({ filePath: 'updateMd.ps1', log: 'update md ssdDB' });
    const updateModel = () =>
        startProcessPA({ filePath: 'updateModel.ps1', log: 'update model' });
    const updateRegister = () =>
        startProcessPA({ filePath: 'updateRegisters.ps1', log: 'update register files' });
    const updateQuotes = () =>
        startProcessPA({ filePath: 'updateQuotes.ps1', log: 'update Quotes file' });
    const updateF19QueryReport = () =>
        startProcessPA({ filePath: 'updateF19QuerryReport.ps1', log: 'update Query report' });

    const sendReportsTG = async () => {
        await bot.doc.pdf({ type: 'vessel', name: 'Модель данных' });
        await bot.doc.pdf({ type: 'tech', name: 'Технический отчет' });
        // await bot.doc.pdf({ type: 'crab', name: 'Выпуск краба за сутки' });
        // await bot.doc.xlsx();
    };
    // updateDB
    const updateModelAll = async () => {
        try {
            updateMd();
            await timePromise(400000);
            updateModel();
            await timePromise(200000);
            // updateF19QueryReport();
            // await timePromise(320000);
            // updateQuotes();
            // await timePromise(550000);

            await sendReportsTG();
        } catch (e) {
            bot.log.bot('UNEXPECTED ERROR in Power api: ' + e.message);
        }
    };

    const sendReestr = () => {
        sendUnsignedReestr();
        sendUnsignedReestrExport();
    };
    ipcMain.on('sendUpdateMd', () => updateMd());
    ipcMain.on('sendUpdateModel', () => updateModel());
    ipcMain.on('sendUpdateQuotes', () => updateQuotes());
    ipcMain.on('sendUpdateRegister', () => updateRegister());
    ipcMain.on('sendUpdateRDO', () => updateRDO());
    ipcMain.on('sendReportDebug', () => sendReportsTG());
    ipcMain.on('sendUpdateModelAll', () => updateModelAll());
    ipcMain.on('sendUpdateF19QuerryReport', () => updateF19QueryReport());
    ipcMain.on('sendUnsignedReestr', sendReestr);

    // planner
    let taskRegistersMd: nodeCron.ScheduledTask;
    let taskReestrMonday: nodeCron.ScheduledTask;
    let taskReestrThursday: nodeCron.ScheduledTask;

    const plannerPA = async () => {
        bot.log.bot('register md log planner started');
        updateRegister();
        await timePromise(15000);
        updateRDO();
    };

    ipcMain.on('sendPlannerRegisterMd', () => {
        if (taskRegistersMd) taskRegistersMd.stop();

        plannerPA();
        taskRegistersMd = nodeCron.schedule('0 0 */4 * * *', plannerPA);
    });

    return {
        updateModelAll,
        plannerPA,
        taskRegistersMd,
        taskReestrMonday,
        taskReestrThursday,
        sendReestr,
    };
};

export type PowerIpcT = ReturnType<typeof setPowerAUIpc>;
