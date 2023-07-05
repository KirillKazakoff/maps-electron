import fs from 'fs';
import xml2js from 'xml2js';
import { CoordsReportJsonT, parseCoordinates } from './parseReportCoords';
import { Coordinates } from '../api/models';

const downloadPath = '/Users/kirillkazakov/Downloads';

export const readXmlCoords = () => {
    const coordsArray: Coordinates[] = [];
    const fileNames = fs.readdirSync(downloadPath, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (!file.name.includes('Список позиций судна')) return;
        if (!file.name.includes('xml')) return;

        const filePath = `${downloadPath}/${file.name}`;
        const xml = fs.readFileSync(filePath);

        xml2js.parseString(xml, { mergeAttrs: true }, (err, res: CoordsReportJsonT) => {
            if (err) throw err;
            const table = res.Report?.table1;
            if (!table) return;

            const coordinates = parseCoordinates(table[0].Detail_Collection[0].Detail);
            coordsArray.push(...coordinates);
        });
    });

    return coordsArray;
};
