import { FormDateT } from '../UI/stores/settingsStore';
import { SettingsLoginT, downloadReports } from '../armRequest/downloadXML/downloadReports';
import { downloadXML } from '../armRequest/downloadXML/downloadXML';
import { login } from '../armRequest/login';
import { readXmlSSD } from './readXmlSSD';

export const downloadSSD = async (date: FormDateT) => {
    const cb = async (settings: SettingsLoginT) => {
        await login(settings);

        for await (const id of settings.vesselsId) {
            console.log(id);
            const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id}&StartDate=${date.start}&EndDate=${date.end}`;
            await downloadXML(reportUrl);
        }
    };

    await downloadReports(cb);
    readXmlSSD();

    console.log('ssd have been read and sent to dËËirectory');
};
