import { SettingsLoginT } from '../downloadXML/downloadReports';
import { login } from '../login';
import { calcARMDateDay } from '../../utils/calcARMDate';
import { downloadXML } from './downloadXML';

export const downloadCoords = async (settings: SettingsLoginT) => {
    const page = await login(settings);
    const vesselListID = page.url().split('/')[4];
    const date = calcARMDateDay({ start: 1, end: 0 });

    const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=18&IsAdaptive=false&VesselListId=${vesselListID}&StartDate=${date.start}&EndDate=${date.end}`;
    await downloadXML(reportUrl);
};
