import {
    SettingsLoginCbT,
    SettingsLoginT,
    downloadReports,
} from '../armRequest/settingsLogin';
import { readXmlSSD } from '../xml/readXmlSSD';
import { readXmlCoords } from '../xml/readXmlCoords';
import { endpoints } from './endpoints';
import { downloadCoords } from '../armRequest/downloadXML/downloadCoords';
import { login } from '../armRequest/login';
import { downloadSSDLast, downloadSSDAll } from '../armRequest/downloadXML/downloadSSD';
import { setFunctionsInPageContext } from '../armRequest/pageParse/setFunctionsInPageContext';

const sendXMLSSD = async () => {
    const ssdList = readXmlSSD();
    endpoints.send.ssdInfo(ssdList);
};

const sendSSD = async (cb: SettingsLoginCbT) => {
    await downloadReports(cb);
    await sendXMLSSD();
};

const sendCoords = async () => {
    await downloadReports(downloadCoords);
    const coordinates = readXmlCoords();
    endpoints.send.coordinates(coordinates);
};

const updateZones = async (settings: SettingsLoginT) => {
    const page = await login(settings);
    const functions = setFunctionsInPageContext(page);
    const zones = await functions.fetchZones();
    endpoints.update.zones(zones);
};

const apiInit = () => {
    return {
        sendXMLSSD: () => sendXMLSSD(),
        sendSSDLast: () => {
            sendSSD(downloadSSDLast);
        },
        sendSSDAll: () => sendSSD(downloadSSDAll),

        updateZones: () => updateZones('' as any),
        sendCoords: () => sendCoords(),
    };
};

export const api = apiInit();
