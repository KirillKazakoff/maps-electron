import { browser } from '../browser';
import { settings } from '../fsModule/readConfig';
import { login } from '../armBrowser/login';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { FormDateT } from '../../UI/stores/settingsStore';
import { bot } from '../../bot/bot';
import { operateF19 } from './operateF19';
import { timePromise } from '../../utils/time';
import { getDateObj } from '../../UI/logic/getDate';

export const downloadF19Report = async (date: FormDateT, isUpdateConfig: boolean) => {
    const timers: NodeJS.Timeout[] = [];

    await login(settings);

    const {
        timeObj: { start, end },
    } = getDateObj().fromDate(date);
    let currentDateTime = start;

    let isFinishLoad = false;
    console.log(isFinishLoad);

    while (!isFinishLoad) {
        const endMonth = currentDateTime.endOf('month').toFormat('dd-MM-yyyy');
        const startMonth = currentDateTime.startOf('month').toFormat('dd-MM-yyyy');

        const downloadF19 = async (docType: 'xml' | 'xlsx') => {
            try {
                await downloadFile({
                    url: `https://mon.cfmc.ru/ReportViewer.aspx?Report=5&IsAdaptive=false&VesselListId=1352447&StartDate=${startMonth}&EndDate=${endMonth}`,
                    docType,
                    timers,
                    timeout: 600000,
                });
            } catch (e) {
                bot.log.bot('F19 Report not downloaded, trying again');
                await browser.clear(timers, true);
                await downloadF19Report(date, isUpdateConfig);

                return;
            }
        };

        await downloadF19('xlsx');
        if (isUpdateConfig) await downloadF19('xml');

        await timePromise(30000);

        isFinishLoad = currentDateTime.endOf('month').equals(end.endOf('month'));
        currentDateTime = currentDateTime.plus({ month: 1 });
    }

    await browser.clear(timers, false);

    operateF19(isUpdateConfig);
};
