import fs from 'fs';
import { getXMLDirPath } from '../fsModule/fsUtils';

export const moveXMLToDownloadsDir = () => {
    const xmlPathes = getXMLDirPath();
    const fileNames = fs.readdirSync(xmlPathes.downloads, { withFileTypes: true });

    fileNames.forEach((file) => {
        if (!file.name.includes('xml')) return;

        const filePath = `${xmlPathes.downloads}\\${file.name}`;
        fs.renameSync(filePath, `${xmlPathes.downloadsSSD}${file.name}`);
    });
};
