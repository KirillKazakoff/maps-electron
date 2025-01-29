import { browser } from '../browser';
import { settings } from '../fsModule/readConfig';
import { login } from '../armBrowser/login';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { FormDateT } from '../../UI/stores/settingsStore';
import { bot } from '../../telegramBot/bot';
import { operateF19 } from './operateF19';
import { timePromise } from '../../utils/time';

export const downloadF19Report = async (date: FormDateT) => {
    const timers: NodeJS.Timeout[] = [];

    await login(settings);

    const downloadF19 = async (docType: 'xml' | 'xlsx') => {
        try {
            await downloadFile({
                url: `https://mon.cfmc.ru/ReportViewer.aspx?Report=5&IsAdaptive=false&VesselListId=1352447&StartDate=${date.start}&EndDate=${date.end}`,
                docType,
                timers,
                timeout: 600000,
            });
        } catch (e) {
            bot.sendLogDated('F19 Report not downloaded, trying again');
            await browser.clear(timers, true);
            await downloadF19Report(date);

            return;
        }
    };

    await downloadF19('xlsx');
    await downloadF19('xml');
    await timePromise(30000);

    await browser.clear(timers, false);

    operateF19();
};
