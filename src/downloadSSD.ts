import { api } from './api/api';
import { browser } from './browser';
import { login } from './pageLogic/login';
import { calcARMDate, calcARMDateNow } from './xml/calcARMDate';
import { downloadXML } from './xml/downloadXML';
import { readXmlSSD } from './xml/readXmlSSD';
import { downloadReports, SettingsLoginCbT, SettingsLoginT } from './xml/settingsLogin';

export const downloadSSDCbLast = async (settings: SettingsLoginT) => {
    await login(settings);
    const vesselsId = await api.get.vesselsByCompany(settings.companyId);
    const date = calcARMDateNow();

    for await (const id of vesselsId) {
        console.log(id);
        const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
        await downloadXML(reportUrl);
    }
};

export const downloadSSDCbAll = async (settings: SettingsLoginT) => {
    await login(settings);
    const vesselsId = await api.get.vesselsByCompany(settings.companyId);

    for await (const id of vesselsId) {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        for await (const i of numbers) {
            console.log(id, i);

            const date = calcARMDate(i);
            const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
            await downloadXML(reportUrl);
        }
    }
};

export const downloadSSD = async (cb: SettingsLoginCbT) => {
    await downloadReports(cb);
    const ssdList = readXmlSSD();
    api.send.ssdInfo(ssdList);
};
