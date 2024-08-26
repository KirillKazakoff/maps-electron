import fs from 'fs';
import { getDirPathes } from '../fsModule/fsPathes';

const xmlPathes = getDirPathes();

export const moveF10 = () => {
    console.log('moving F10');
    const ssdFileNames = fs.readdirSync(`${xmlPathes.downloads}`, {
        withFileTypes: true,
    });

    ssdFileNames.forEach((file) => {
        if (!file.name.includes('Ф10')) return;
        const filePath = `${xmlPathes.downloads}\\${file.name}`;

        const newPath = `${xmlPathes.quotes}\\Квоты 2024.xlsx`;
        fs.renameSync(filePath, newPath);
    });
};
