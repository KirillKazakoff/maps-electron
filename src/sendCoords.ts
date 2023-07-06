import { downloadReports, SettingsLoginT } from './xml/settingsLogin';
import { readXmlCoords } from './xml/readXmlCoords';
import { login } from './pageLogic/login';
import { calcARMDateNow } from './xml/calcARMDate';
import { downloadXML } from './xml/downloadXML';
import { api } from './api/api';

const sendCoordsCb = async (settings: SettingsLoginT) => {
    const page = await login(settings);
    // await page.goto('https://mon.cfmc.ru');
    const vesselListID = page.url().split('/')[4];
    const date = calcARMDateNow();

    const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=18&IsAdaptive=false&VesselListId=${vesselListID}&StartDate=${date.start}&EndDate=${date.end}`;
    await downloadXML(reportUrl);
};

export const sendCoords = async () => {
    // await downloadReports(sendCoordsCb);
    const coordinates = readXmlCoords();
    api.send.coordinates(coordinates);
};
