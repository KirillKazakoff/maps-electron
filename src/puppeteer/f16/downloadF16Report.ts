import { browser } from '../browser';
import { FormDateT } from '../../UI/stores/settingsStore';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { login } from '../armBrowser/login';
import { moveF16 } from './moveF16';
import { bot } from '../../bot/bot';
import { settings } from '../fsModule/readConfig';
import { ParsedSSDT } from './parseF16/parseF16';

export const downloadF16Report = async (date: FormDateT, vesselsArray: string[]) => {
    let vessels = Array.from(new Set(vesselsArray));
    const f16Data: ParsedSSDT[][] = [];

    const recurseLoad = async () => {
        const timers: NodeJS.Timeout[] = [];
        const loginStatus = await login(settings);

        let currentId = vessels[0];

        // download f16 reports by vessel id list
        for await (const id of vessels) {
            try {
                // check status login here if first login error
                if (!loginStatus) throw new Error('no_login');
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
                bot.log.bot('F16 report not downloaded, restart ' + 'on vessel id ' + id);

                await browser.clear(timers, true);
                await recurseLoad();
                return;
            }
        }

        await browser.clear(timers, false);

        // reduce ssd all together
        const f16DataPart = moveF16();
        f16Data.push(...f16DataPart);
    };

    await recurseLoad();

    bot.log.bot('SSD F16 uploaded successfuly');
    return f16Data;
};
