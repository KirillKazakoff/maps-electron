import { downloadReports, SettingsLoginT } from './xml/settingsLogin';
import { readXmlCoords } from './xml/readXmlCoords';
import { loginOsm } from './pageLogic/login';
import { calcARMDateNow } from './xml/calcARMDate';
import { downloadXML } from './xml/downloadXML';

const downloadCoordsCb = async (settings: SettingsLoginT) => {
    const { vesselsId, browser, page } = await loginOsm(settings);
    await page.goto('https://mon.cfmc.ru');
    const vesselListID = page.url().split('/')[4];
    const date = calcARMDateNow();

    const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=18&IsAdaptive=false&VesselListId=${vesselListID}&StartDate=${date.start}&EndDate=${date.end}`;
    await downloadXML(browser, reportUrl);
};

export const downloadCoords = async () => {
    await downloadReports(downloadCoordsCb);
    readXmlCoords();
};
