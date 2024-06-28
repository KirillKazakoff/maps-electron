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

const xmlPathes = getXMLDirPath();

export const readXmlSSD = () => {
    const ssdInfoArray = initSSDInfo();
    const fileNames = fs.readdirSync(xmlPathes.downloads, { withFileTypes: true });

    // moveToSSDDirectory
    fileNames.forEach((file) => {
        if (!file.name.includes('xml')) return;

        const filePath = `${xmlPathes.downloads}\\${file.name}`;
        fs.renameSync(filePath, `${xmlPathes.downloadsSSD}${file.name}`);
    });

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
                return ssdInfoArray.ssd.some((ssd) => ssd.vessel_id === s.vessel_id);
            })) return;

            ssdInfoArray.ssd.push(...ssdInfo.ssd);
            ssdInfoArray.productionDetails.push(...ssdInfo.productionDetails);
            ssdInfoArray.productionInput.push(...ssdInfo.productionInput);
            ssdInfoArray.productionTransport.push(...ssdInfo.productionTransport);
            ssdInfoArray.reserve.push(...ssdInfo.reserve);
            ssdInfoArray.bait.push(...ssdInfo.bait);
        });

        if (!currentSSD) {
            fs.unlinkSync(filePath);
            return;
        }

        currentSSD = currentSSD as SSDInfo;

        renameXML(currentSSD.ssd, filePath);
    });

    console.log('ssd have been read and sent to directory');
    // console.log(ssdInfoArray.ssd);
    return ssdInfoArray;
};
