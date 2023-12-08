import fs from 'fs';
import xml2js from 'xml2js';
import { CoordsReportJsonT, parseReportCoords } from './parseReportSSD/parseReportCoords';
import { Coordinates } from '../api/models';

const downloadPath = '/Users/kirillkazakov/Downloads';

export const readXmlCoords = () => {
    const coordsArray: Coordinates[] = [];
    const fileNames = fs.readdirSync(downloadPath, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (['Список позиций судна', 'xml'].some((title) => file.name.includes(title))) {
            return;
        }

        const filePath = `${downloadPath}/${file.name}`;
        const xml = fs.readFileSync(filePath);

        xml2js.parseString(xml, { mergeAttrs: true }, (err, res: CoordsReportJsonT) => {
            if (err) throw err;
            const table = res.Report?.table1;
            if (!table) return;

            const coordinates = parseReportCoords(table[0].Detail_Collection[0].Detail);
            coordsArray.push(...coordinates);
        });
    });

    return coordsArray;
};
