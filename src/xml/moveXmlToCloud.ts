import xml2js from 'xml2js';
import fs from 'fs';
import {
    parseReportSSD,
    ReportT,
    initSSDInfo,
    SSDInfo,
} from './parseReportSSD/parseReportSSD';
import { getXMLDirPath } from '../fsModule/fsUtils';
import { renameXML } from '../fsModule/renameXML';
import { moveXMLToDownloadsDir } from './moveXMLToDownloadsDir';

const xmlPathes = getXMLDirPath();

export const moveXMLToCloud = () => {
    moveXMLToDownloadsDir();
    const ssdArray = initSSDInfo();

    const ssdFileNames = fs.readdirSync(`${xmlPathes.downloadsSSD}`, {
        withFileTypes: true,
    });

    // readSSDAndRename
    ssdFileNames.forEach((file) => {
        if (!file.name.includes('xml')) return;

        const filePath = `${xmlPathes.downloadsSSD}${file.name}`;
        const xml = fs.readFileSync(filePath);

        let currentSSD: SSDInfo | null = null;
        xml2js.parseString(xml, { mergeAttrs: true }, (err, result: ReportT) => {
            if (err) {
                console.log(err);
                return;
            }

            const ssdInfo = parseReportSSD(result);
            currentSSD = ssdInfo;

            if (!ssdInfo) return;
            // prettier-ignore
            if (ssdInfo.ssd.some((s) => {
                return ssdArray.ssd.some((ssd) => ssd.vessel_id === s.vessel_id);
            })) return;

            ssdArray.ssd.push(...ssdInfo.ssd);
            ssdArray.productionDetails.push(...ssdInfo.productionDetails);
            ssdArray.productionInput.push(...ssdInfo.productionInput);
            ssdArray.productionTransport.push(...ssdInfo.productionTransport);
            ssdArray.reserve.push(...ssdInfo.reserve);
            ssdArray.bait.push(...ssdInfo.bait);
        });

        if (!currentSSD) {
            fs.unlinkSync(filePath);
            return;
        }

        currentSSD = currentSSD as SSDInfo;

        renameXML(currentSSD.ssd, filePath);
    });

    console.log('ssd have been sent to the Cloud');

    return ssdArray;
};
