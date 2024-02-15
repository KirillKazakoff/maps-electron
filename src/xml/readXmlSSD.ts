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

        const filePath = `${xmlPathes.downloads}/${file.name}`;
        fs.renameSync(filePath, `${xmlPathes.downloadsSSD}${file.name}`);
    });

    const ssdFileNames = fs.readdirSync(`${xmlPathes.downloadsSSD}`, {
        withFileTypes: true,
    });

    console.log(ssdFileNames);

    // readSSDAndRename
    ssdFileNames.forEach((file) => {
        if (!file.name.includes('xml')) return;

        const filePath = `${xmlPathes.downloadsSSD}${file.name}`;
        const xml = fs.readFileSync(filePath);

        let currentSSD: SSDInfo | null = null;
        xml2js.parseString(xml, { mergeAttrs: true }, (err, result: ReportT) => {
            if (err) throw err;

            const ssdInfo = parseReportSSD(result);
            currentSSD = ssdInfo;

            if (!ssdInfo) return;
            if (ssdInfo.ssd.some((s) => ssdInfoArray.ssd.some((ssd) => ssd.id === s.id)))
                return;

            ssdInfoArray.ssd.push(...ssdInfo.ssd);
            ssdInfoArray.productionDetails.push(...ssdInfo.productionDetails);
            ssdInfoArray.productionInput.push(...ssdInfo.productionInput);
            ssdInfoArray.productionTransport.push(...ssdInfo.productionTransport);
            ssdInfoArray.reserve.push(...ssdInfo.reserve);
            ssdInfoArray.bait.push(...ssdInfo.bait);
        });

        if (!currentSSD) {
            fs.unlink(filePath, (err) => {
                if (err) console.log(err);
            });
            return;
        }

        currentSSD = currentSSD as SSDInfo;

        renameXML(currentSSD.ssd, filePath);
    });

    return ssdInfoArray;
};
