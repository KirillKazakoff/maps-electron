import { ipcMain, utilityProcess } from 'electron';
import { bot } from './telegramBot/bot';
import { getDateObj } from './UI/logic/getDate';
import { FormDateT } from './UI/stores/settingsStore';
import { CheckBoxSettingsT } from './utils/types';
import childProcess from 'child_process';
import nodeCron from 'node-cron';
import { downloadSSD } from './xml/downloadSSD';
import { moveXMLToCloud } from './xml/moveXmlToCloud';
import { sendInfoBot } from './xml/sendInfoBot';
import { timePromise } from './utils/time';
import { readConfig, settingsLogin } from './utils/readConfig';
import { downloadF19Report } from './xml/F19/downloadF19Report';
import { calcARMDateFromNow } from './utils/calcARMDate';
import { parseF19 } from './xml/F19/parseF19';

export const addIpcListeners = () => {
    // osm download ssd
    ipcMain.on('downloadSSDDate', (e, date: FormDateT) => {
        readConfig();
        downloadSSD(date);
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
        const ssd = moveXMLToCloud();
        sendInfoBot(ssd);
    });

    const cbPlanner = async () => {
        bot.sendAll('Planner SSD started');
        readConfig();

        await downloadSSD(getDateObj().fromYearStart());
        bot.sendAll('F19 report load started');
        downloadF19Report(calcARMDateFromNow());
    };
    ipcMain.on('sendManual', () => cbPlanner());

    let taskOsm: nodeCron.ScheduledTask;
    ipcMain.on('sendPlanner', (e, schedule) => {
        console.log(schedule);
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

    // update registers md
    const updateRegister = () => {
        utilityProcess.fork('C:\\RunFlow.ps1');
        childProcess.spawn('C:\\RunFlow.ps1', { shell: 'powershell.exe' });
        console.log('update register files');
    };

    const updateMd = () => {
        utilityProcess.fork('C:\\RunFlowPDF.ps1');
        childProcess.spawn('C:\\RunFlowPDF.ps1', { shell: 'powershell.exe' });
        console.log('update md ssdDB files');
    };

    ipcMain.on('sendUpdateRegister', () => updateRegister());

    ipcMain.on('sendUpdateMd', () => updateMd());

    let taskRegistersMd: nodeCron.ScheduledTask;
    const plannerRegisterMd = async () => {
        bot.sendAll('register md log planner started');

        updateMd();
        await timePromise(500000);
        updateRegister();
    };

    ipcMain.on('sendPlannerRegisterMd', () => {
        nodeCron.getTasks().forEach((t) => t.stop());
        if (taskRegistersMd) taskRegistersMd.stop();

        plannerRegisterMd();
        taskRegistersMd = nodeCron.schedule('0 0 2 * * *', plannerRegisterMd);
    });

    ipcMain.handle('getDefaultSettings', () => settingsLogin);
};
