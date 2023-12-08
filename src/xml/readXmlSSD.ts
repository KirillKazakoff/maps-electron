import xml2js from 'xml2js';
import fs from 'fs';
import { parseReportSSD, ReportT, initSSDInfo } from './parseReportSSD/parseReportSSD';

const downloadPath = '/Users/kirillkazakov/Downloads';

export const readXmlSSD = () => {
    const ssdInfoArray = initSSDInfo();
    const fileNames = fs.readdirSync(downloadPath, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (!file.name.includes('Судовые суточные донесения')) return;
        if (!file.name.includes('xml')) return;

        const filePath = `${downloadPath}/${file.name}`;
        const xml = fs.readFileSync(filePath);

        xml2js.parseString(xml, { mergeAttrs: true }, (err, result: ReportT) => {
            if (err) throw err;

            const ssdInfo = parseReportSSD(result);

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

        // deleteXML
        // fs.unlink(filePath, (err) => {
        //     if (err) console.log(err);
        // });
    });

    return ssdInfoArray;
};
