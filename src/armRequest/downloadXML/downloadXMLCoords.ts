import { calcARMDateDay } from '../../utils/calcARMDate';
import { login } from '../login';
import { SettingsLoginT } from '../downloadXML/downloadReports';
import { downloadXML } from './downloadXML';

export const downloadXMLCoords = async (settings: SettingsLoginT) => {
    const page = await login(settings);
    await page.goto('https://mon.cfmc.ru');
    const vesselListID = page.url().split('/')[4];
    const date = calcARMDateDay({ start: 1, end: 0 });

    const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=18&IsAdaptive=false&VesselListId=${vesselListID}&StartDate=${date.start}&EndDate=${date.end}`;
    await downloadXML(reportUrl);
};
