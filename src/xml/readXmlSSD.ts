import xml2js from 'xml2js';
import fs from 'fs';
import {
    parseReportSSD,
    ReportT,
    initSSDInfo,
    SSDInfo,
} from './parseReportSSD/parseReportSSD';
import { getUserName } from '../fsModule/getUserName';

const downloadPath = `/Users/${getUserName()}/Downloads`;

export const readXmlSSD = () => {
    const ssdInfoArray = initSSDInfo();
    const fileNames = fs.readdirSync(downloadPath, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (!file.name.includes('xml')) return;

        const filePath = `${downloadPath}/${file.name}`;
        const xml = fs.readFileSync(filePath);

        let currentSSD: SSDInfo;
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

        const date = currentSSD.ssd[currentSSD.ssd.length - 1].date;
        fs.renameSync(
            filePath,
            `${downloadPath}/SSD/SSD_${currentSSD.ssd[0].vessel_id}_${date}.xml`
        );
    });

    return ssdInfoArray;
};
