import { SSD } from '../api/models';
import fs from 'fs';
import { getXMLDirPath } from './fsUtils';
import { DateTime } from 'luxon';

export const renameXML = (ssdList: SSD[], oldPath: string) => {
    const pathes = getXMLDirPath();
    const path = pathes.ssd;
    const ssd = ssdList[ssdList.length - 1];

    const dateTime = DateTime.fromFormat(ssd.date, 'dd.MM.yyyy');
    const formatedDate = dateTime.toFormat('yyyy-MM-dd');

    // remove if same ssd vessel was before in directory
    const cloudSSDNames = fs.readdirSync(`${getXMLDirPath().ssd}`, {
        withFileTypes: true,
    });

    const oldSSDNames = cloudSSDNames.filter((dirent) => {
        const id = dirent.name.split(/[_.]/)[3];
        return id === ssd.vessel_id;
    });

    if (ssd.vessel_name.toLowerCase().includes('омолон')) {
        console.log(oldSSDNames);
    }

    oldSSDNames.forEach((file) => {
        const filePath = `${path}${file.name}`;
        fs.unlinkSync(filePath);
    });

    // // move ssd to icloud directory
    // prettier-ignore
    const newPath = `${path}SSD_${formatedDate}_${ssd.vessel_name.toUpperCase()}_${ssd.vessel_id}.xml`;
    fs.renameSync(oldPath, newPath);
};
