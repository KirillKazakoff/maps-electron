import xml2js from 'xml2js';
import fs from 'fs';
import { parseF16, ReportT, initSSDInfo, SSDInfo } from './parseF16/parseF16';
import { getDirPathes } from '../fsModule/fsPathes';
import { moveF16Cloud } from './moveF16Cloud';
import { moveF16XmlDownloads } from './moveF16XmlDownloads';

const xmlPathes = getDirPathes();

export const moveF16 = () => {
    moveF16XmlDownloads();
    const ssdArray = initSSDInfo();

    const ssdFileNames = fs.readdirSync(`${xmlPathes.downloadsSSD}`, {
        withFileTypes: true,
    });

    // readSSDAndRename
    ssdFileNames.forEach((file) => {
        if (!file.name.includes('Ф16')) return;

        const filePath = `${xmlPathes.downloadsSSD}${file.name}`;
        const xml = fs.readFileSync(filePath);

        let currentSSD: SSDInfo | null = null;
        xml2js.parseString(xml, { mergeAttrs: true }, (err, result: ReportT) => {
            if (err) {
                console.log(err);
                return;
            }

            const ssdInfo = parseF16(result);
            currentSSD = ssdInfo;

            console.log('parse F16');
            console.log(ssdInfo);
            if (!ssdInfo) return;
            // prettier-ignore
            if (ssdInfo.ssd.some((s) => {
                return ssdArray.ssd.some((ssd) => ssd.vessel_id === s.vessel_id);
            })) return;

            ssdArray.ssd.push(...ssdInfo.ssd);
            ssdArray.productionDetails.push(...ssdInfo.productionDetails);
            ssdArray.productionInput.push(...ssdInfo.productionInput);
        });

        if (!currentSSD) {
            fs.unlinkSync(filePath);
            return;
        }

        currentSSD = currentSSD as SSDInfo;

        moveF16Cloud(currentSSD.ssd, filePath);
    });

    console.log('ssd have been sent to the Cloud');

    return ssdArray;
};
