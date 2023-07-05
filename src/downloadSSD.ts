import { api } from './api/api';
import { loginOsm } from './pageLogic/login';
import { calcARMDate, calcARMDateNow } from './xml/calcARMDate';
import { downloadXML } from './xml/downloadXML';
import { readXmlSSD } from './xml/readXmlSSD';
import { downloadReports, SettingsLoginCbT, SettingsLoginT } from './xml/settingsLogin';

export const downloadSSDCbLast = async (settings: SettingsLoginT) => {
    const { vesselsId, browser, page } = await loginOsm(settings);
    const date = calcARMDateNow();

    for await (const id of vesselsId) {
        // eslint-disable-next-line no-console
        console.log(id);
        const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
        await downloadXML(browser, reportUrl);
    }

    await page.goto('https://mon.cfmc.ru');
    const vesselListID = page.url().split('/')[4];

    const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=18&IsAdaptive=false&VesselListId=${vesselListID}&StartDate=${date.start}&EndDate=${date.end}`;
    await downloadXML(browser, reportUrl);
};

export const downloadSSDCbAll = async (settings: SettingsLoginT) => {
    const { vesselsId, browser } = await loginOsm(settings);

    for await (const id of vesselsId) {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        for await (const i of numbers) {
            console.log(id);

            const date = calcARMDate(i);
            const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
            await downloadXML(browser, reportUrl);
        }
    }
};

export const downloadSSD = async (cb: SettingsLoginCbT) => {
    await downloadReports(cb);
    const ssdList = readXmlSSD();
    api.send.ssdInfo(ssdList);
};
