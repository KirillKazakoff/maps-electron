import { browser } from '../browser';
import { settingsLogin } from '../fsModule/readConfig';
import { login } from '../armBrowser/login';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { FormDateT } from '../../UI/stores/settingsStore';
import { bot } from '../../telegramBot/bot';
import { operateF19 } from './operateF19';
import { timePromise } from '../../utils/time';

export const downloadF19Report = async (date: FormDateT) => {
    const timers: NodeJS.Timeout[] = [];
    const settings = settingsLogin[0];

    await login(settings);

    const downloadF19 = async (docType: 'xml' | 'xlsx') => {
        try {
            await downloadFile({
                url: `https://mon.cfmc.ru/ReportViewer.aspx?Report=5&IsAdaptive=false&VesselListId=1352447&StartDate=${date.start}&EndDate=${date.end}`,
                docType,
                timers,
            });
        } catch (e) {
            if (e.message === 'error_restart') {
                bot.sendSSDLog('F19 Report not downloaded, trying again');
                await browser.clear(timers);
                await downloadF19Report(date);

                return;
            }

            console.error(e.message);
        }
    };

    await downloadF19('xlsx');
    await downloadF19('xml');
    await timePromise(30000);

    await browser.clear(timers);

    operateF19();
};
