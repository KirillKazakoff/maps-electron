import fs from 'fs';
import xml2js from 'xml2js';
import { CoordsReportJsonT, parseCoordinates } from './parseReportCoords';

export const readXmlCoords = () => {
    const downloadPath = '/Users/kirillkazakov/Downloads';
    const fileNames = fs.readdirSync(downloadPath, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (!file.name.includes('Список позиций судна')) return;
        if (!file.name.includes('xml')) return;

        const filePath = `${downloadPath}/${file.name}`;
        const xml = fs.readFileSync(filePath);

        xml2js.parseString(xml, { mergeAttrs: true }, (err, res: CoordsReportJsonT) => {
            const table = res.Report?.table1;
            if (!table) return;
            const coordinates = parseCoordinates(table[0].Detail_Collection[0].Detail);
            console.log(coordinates);
        });
    });
};
