import { readXmlSSD } from '../xml/readXmlSSD';
import { readXmlCoords } from '../xml/readXmlCoords';
import { downloadCoords } from '../armRequest/downloadXML/downloadCoords';
import { login } from '../armRequest/login';
import {
    downloadSSDSingle,
    downloadSSDMultiple,
    downloadSSDFromMonthStart,
} from '../armRequest/downloadXML/downloadSSD';
import { setFunctionsInPageContext } from '../armRequest/pageParse/setFunctionsInPageContext';
import {
    SettingsLoginCbT,
    downloadReports,
    SettingsLoginT,
} from '../armRequest/downloadXML/downloadReports';
import { endpoints } from './endpoints';

class Api {
    async sendXMLSSD() {
        const ssd = readXmlSSD();
        endpoints.send.ssdInfo(ssd);
    }

    async downloadSSD(cb: SettingsLoginCbT) {
        await downloadReports(cb);
        readXmlSSD();
    }

    async downloadSSDFromMonth() {
        await this.downloadSSD(downloadSSDFromMonthStart);
    }
    async downloadSSDSingle() {
        await this.downloadSSD(downloadSSDSingle);
    }
    async downloadSSDAll() {
        await this.downloadSSD(downloadSSDMultiple);
    }

    async sendDownloadCoords() {
        await downloadReports(downloadCoords);
        const coordinates = readXmlCoords();

        endpoints.send.coordinates(coordinates);
    }

    async updateZones(settings: SettingsLoginT) {
        const page = await login(settings);
        const functions = setFunctionsInPageContext(page);
        const zones = await functions.fetchZones();

        endpoints.update.zones(zones);
    }
}

export const api = new Api();
