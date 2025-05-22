import { browser } from '../browser';
import { login } from '../armBrowser/login';
import { settings } from '../fsModule/readConfig';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { bot } from '../../bot/bot';
import { f10Browser } from './f10Browser';
import { moveF10 } from './moveF10';
import { FormDateT } from '../../UI/stores/settingsStore';
import { getDateObj } from '../../UI/logic/getDate';
import { calcDateF10 } from '../../utils/date';

export const downloadF10Report = async (date: FormDateT, isFormDate: boolean) => {
    const timers: NodeJS.Timeout[] = [];

    await login(settings);

    const {
        timeObj: { start, end },
    } = getDateObj().fromDate(date);
    let currentDate = start;
    const format = 'yyyy-MM-dd';

    while (!currentDate.equals(end)) {
        try {
            const page = await f10Browser({
                url: 'https://mon.cfmc.ru/ReportViewer.aspx?Report=28&IsAdaptive=false&OwnerListId=116124',
                timers,
                dateReport: calcDateF10({ isTime: true, dateTime: currentDate }),
            });
            if (!page) throw new Error('error_restart');

            await downloadFile({
                docType: 'xlsx',
                timers,
                page,
                timeout: 600000,
            });

            moveF10(currentDate.toFormat(format), isFormDate);
        } catch (e) {
            bot.log.botDated('F10 Report not downloaded, trying again');
            await browser.clear(timers, true);

            await downloadF10Report(
                {
                    start: currentDate.toFormat(format),
                    end: end.toFormat(format),
                },
                isFormDate
            );

            return;
        }

        currentDate = currentDate.plus({ day: 1 });
    }

    await browser.clear(timers, false);
};
