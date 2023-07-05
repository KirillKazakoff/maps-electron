import { login } from '../pageLogic/login';
import { calcARMDateNow } from './calcARMDate';
import { downloadXML } from './downloadXML';
import { SettingsLoginT } from './settingsLogin';

export const downloadXMLCoords = async (settings: SettingsLoginT) => {
    const page = await login(settings);
    await page.goto('https://mon.cfmc.ru');
    const vesselListID = page.url().split('/')[4];
    const date = calcARMDateNow();

    const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=18&IsAdaptive=false&VesselListId=${vesselListID}&StartDate=${date.start}&EndDate=${date.end}`;
    await downloadXML(reportUrl);
};
