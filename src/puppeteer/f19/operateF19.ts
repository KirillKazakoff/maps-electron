import xml2js from 'xml2js';
import { getDirPathes } from '../fsModule/fsPathes';
import fs from 'fs';
import { F19T } from '../../utils/types';
import { vessels, rewriteConfig } from '../fsModule/readConfig';
import { bot } from '../../telegramBot/bot';
import { getDateF19Report } from '../../utils/date';

const xmlPathes = getDirPathes();

export const operateF19 = () => {
    const fileNames = fs.readdirSync(`${xmlPathes.downloads}`, {
        withFileTypes: true,
    });

    fileNames.forEach((file) => {
        if (!file.name.includes('Ф19')) return;
        const filePath = `${xmlPathes.downloads}\\${file.name}`;

        // send xlsx report to cloud dir
        if (file.name.includes('xlsx')) {
            const fileName = getDateF19Report();
            console.log(fileName);
            const filePathNew = `${xmlPathes.f19}\\${fileName}.xlsx`;

            fs.renameSync(filePath, filePathNew);
            return;
        }

        // add new vessels to config
        const xml = fs.readFileSync(filePath);

        const newVessels: string[] = [];
        xml2js.parseString(xml, { mergeAttrs: true }, (err, res: F19T) => {
            if (err) {
                console.log(err);
                return;
            }

            const details = res.Report.Tablix1[0].Details_Collection[0].Details;

            if (!details) return null;

            details.forEach(({ VES2: vessel, FISH: product }) => {
                const id = vessel[0].split(/[()]/)[1];
                const isEqualRecord = vessels.main.some((v) => v === id);
                const isCrab = product && product[0].includes('краб');
                const isException = vessels.exception.some((v) => v === id);

                if (!product) return;

                if (!isEqualRecord && !isException && isCrab) {
                    newVessels.push(id);
                }

                // cut if exeption already in vessel list
                if (isException) {
                    const index = vessels.main.indexOf(id);
                    if (index === -1) return;

                    vessels.main.splice(index, 1);
                }
            });
        });

        const setVessels = Array.from(new Set(newVessels));

        if (setVessels.length > 0) {
            bot.sendLog('new vessels registered are ' + setVessels.join(' '));
        }

        // fsWrite new vessels
        vessels.main.push(...setVessels);

        // removeDublicates
        try {
            const vessels2 = Array.from(new Set(vessels.main));
            console.log(vessels2);
            vessels.main = [...vessels2];

            rewriteConfig();
            fs.unlinkSync(filePath);
        } catch (e) {
            console.log(e);
        }
    });

    bot.sendLogDated(`F19 report xml xlsx loaded`);
};
