import xml2js from 'xml2js';
import fs from 'fs';
import { ParsedSSDT, parseF16, ReportT } from './parseF16/parseF16';
import { getDirPathes } from '../fsModule/fsPathes';
import { moveF16Cloud } from './moveF16Cloud';
import { moveF16XmlDownloads } from './moveF16XmlDownloads';

const pathes = getDirPathes();

export const moveF16 = (status?: 'debug') => {
    moveF16XmlDownloads();
    const f16Array: ParsedSSDT[][] = [];

    const ssdFileNames = fs.readdirSync(`${pathes.downloadsSSD}`, {
        withFileTypes: true,
    });

    // read xml ssd => parse => rename and move to cloud
    ssdFileNames.forEach((file) => {
        if (!file.name.includes('Ф16')) return;

        const filePath = `${pathes.downloadsSSD}${file.name}`;
        const xml = fs.readFileSync(filePath);

        let currentSSD: ParsedSSDT[] = [];
        xml2js.parseString(xml, { mergeAttrs: true }, (err, result: ReportT) => {
            if (err) {
                console.log(err);
                return;
            }

            const parsedF16 = parseF16(result);
            currentSSD = parsedF16;

            if (!parsedF16) return;

            // check if same ssd already in array
            const isSameVesselInParsed = parsedF16.some((ssdNew) => {
                return f16Array.some((f16) => {
                    return f16.some(
                        (ssdPrev) => ssdPrev.info.vessel_id === ssdNew.info.vessel_id
                    );
                });
            });
            if (isSameVesselInParsed) return;

            f16Array.push(parsedF16);
        });

        if (!currentSSD) {
            fs.unlinkSync(filePath);
            return;
        }

        if (status === 'debug') return;
        moveF16Cloud(currentSSD, filePath);
    });

    console.log('ssd have been sent to the Cloud');
    return f16Array;
};
