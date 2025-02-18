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
    let current = start;
    const format = 'yyyy-MM-dd';

    while (!current.equals(end)) {
        console.log('cycle goes');

        try {
            const page = await f10Browser({
                url: 'https://mon.cfmc.ru/ReportViewer.aspx?Report=28&IsAdaptive=false&OwnerListId=116124&Date=08-08-2024',
                timers,
                dateReport: calcDateF10({ isTime: true, dateTime: current }),
            });
            if (!page) throw new Error('error_restart');

            await downloadFile({
                docType: 'xlsx',
                timers,
                page,
                timeout: 600000,
            });

            moveF10(current.toFormat(format), isFormDate);
        } catch (e) {
            bot.log.botDated('F10 Report not downloaded, trying again');
            await browser.clear(timers, true);

            await downloadF10Report(
                {
                    start: current.toFormat(format),
                    end: end.toFormat(format),
                },
                isFormDate
            );

            return;
        }

        current = current.plus({ day: 1 });
    }

    await browser.clear(timers, false);
};
