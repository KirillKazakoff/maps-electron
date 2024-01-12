import {
    calcARMDateDay,
    calcARMDateFromNow,
    calcARMDateMonth,
} from '../../utils/calcARMDate';
import { login } from '../login';
import { SettingsLoginT } from './downloadReports';
import { downloadXML } from './downloadXML';

export const downloadSSDSingle = async (settings: SettingsLoginT) => {
    console.log('START LOADING');
    await login(settings);

    const date = calcARMDateDay({ start: 7, end: -1 });

    for await (const id of settings.vesselsId) {
        console.log(id);
        const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
        await downloadXML(reportUrl);
    }
};

export const downloadSSDFromMonthStart = async (settings: SettingsLoginT) => {
    console.log('START LOADING');
    await login(settings);

    const date = calcARMDateFromNow();

    for await (const id of settings.vesselsId) {
        console.log(id);
        const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
        await downloadXML(reportUrl);
    }
};

export const downloadSSDMultiple = async (settings: SettingsLoginT) => {
    await login(settings);
    // const vesselsId = await endpoints.get.vesselsByCompany(settings.companyId);

    for await (const id of settings.vesselsId) {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        for await (const i of numbers) {
            console.log(id, i);

            const date = calcARMDateMonth(i);
            const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
            await downloadXML(reportUrl);
        }
    }
};
