import { browser } from '../browser';
import { FormDateT } from '../../UI/stores/settingsStore';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { login } from '../armBrowser/login';
import { moveF16 } from './moveF16';
import { bot } from '../../telegramBot/bot';
import { settings } from '../fsModule/readConfig';
import { ParsedSSDT } from './parseF16/parseF16';

export const downloadF16Report = async (date: FormDateT, vesselsArray: string[]) => {
    let vessels = Array.from(new Set(vesselsArray));
    const f16Data: ParsedSSDT[][] = [];

    const recurseCb = async () => {
        const timers: NodeJS.Timeout[] = [];

        const loginStatus = await login(settings);
        if (!loginStatus) return 'no_login';

        let currentId = vessels[0];
        console.log(currentId);

        // download f16 reports by vessel id list
        for await (const id of vessels) {
            try {
                console.log(id);

                currentId = id;
                await downloadFile({
                    url: `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=false&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`,
                    docType: 'xml',
                    timers,
                    timeout: 200000,
                });
            } catch (e) {
                // if error_restart occurs while download file
                vessels = vessels.slice(vessels.indexOf(currentId));
                bot.sendLog('F16 report not downloaded, restart ' + 'on vessel id ' + id);

                await browser.clear(timers, true);
                await recurseCb();
                return;
            }
        }

        await browser.clear(timers, false);

        // reduce ssd all together
        const f16DataPart = moveF16();
        f16Data.push(...f16DataPart);
    };

    const loginStatus = await recurseCb();
    if (loginStatus === 'no_login') return false;

    bot.sendLogDated('SSD uploaded successfuly');
    return f16Data;
};
