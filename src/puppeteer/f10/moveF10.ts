import fs from 'fs';
import { getDirPathes } from '../fsModule/fsPathes';
import { bot } from '../../bot/bot';

const xmlPathes = getDirPathes();

export const moveF10 = (date: string, isFormDate: boolean) => {
    console.log('moving F10');
    const ssdFileNames = fs.readdirSync(`${xmlPathes.downloads}`, {
        withFileTypes: true,
    });

    ssdFileNames.forEach((file) => {
        if (!file.name.includes('Ф10')) return;
        const filePath = `${xmlPathes.downloads}\\${file.name}`;

        const pathDir = isFormDate ? xmlPathes.quotesFormDate : xmlPathes.quotes;
        const newPath = `${pathDir}\\${date}.xlsx`;
        fs.copyFileSync(filePath, newPath);
        fs.unlinkSync(filePath);
        // fs.renameSync(filePath, newPath);

        bot.log.bot(`F10 quotes report ${date} loaded`);
    });
};
