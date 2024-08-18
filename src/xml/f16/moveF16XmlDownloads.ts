import fs from 'fs';
import { getDirPathes } from '../fsModule/fsUtils';

export const moveF16XmlDownloads = () => {
    const xmlPathes = getDirPathes();
    const fileNames = fs.readdirSync(xmlPathes.downloads, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (!file.name.includes('xml')) return;

        const filePath = `${xmlPathes.downloads}\\${file.name}`;
        fs.renameSync(filePath, `${xmlPathes.downloadsSSD}${file.name}`);
    });
};
