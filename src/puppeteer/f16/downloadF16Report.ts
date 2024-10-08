import { browser } from '../browser';
import { FormDateT } from '../../UI/stores/settingsStore';
import { downloadFile } from '../armBrowser/downloadFile/downloadFile';
import { login } from '../armBrowser/login';
import { moveF16 } from './moveF16';
import { bot } from '../../telegramBot/bot';
import { SettingsLoginT } from '../../utils/types';
import { sendF16InfoBot } from './sendF16InfoBot';
import { settingsLogin } from '../fsModule/readConfig';

export type SettingsLoginCbT = (settings: SettingsLoginT[]) => Promise<any>;

export const downloadF16Report = async (date: FormDateT) => {
    const timers: NodeJS.Timeout[] = [];

    console.log(settingsLogin);

    const settings = settingsLogin[0];
    const { vesselsId } = settings;

    await login(settings);

    let currentId = vesselsId[0];
    console.log(currentId);

    for await (const id of vesselsId) {
        try {
            console.log(id);
            currentId = id;
            await downloadFile({
                url: `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=false&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`,
                docType: 'xml',
                timers,
            });
        } catch (e) {
            if (e.message === 'error_restart') {
                settings.vesselsId = vesselsId.slice(vesselsId.indexOf(currentId));
                await browser.clear(timers);
                await downloadF16Report(date);

                return;
            }

            bot.sendSSDLog('error occur' + e.message + 'on vessel id ' + id);
        }
    }

    await browser.clear(timers);

    const ssdArray = moveF16();

    sendF16InfoBot(ssdArray);
    bot.sendSSDLog('SSD uploaded successfuly');

    // reinitVesselsId on finish load ssd
    settings.vesselsId = [...settingsLogin[2].vesselsId];
};
