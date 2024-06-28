import { SSD } from '../api/models';
import fs from 'fs';
import { getXMLDirPath } from './fsUtils';
import { DateTime } from 'luxon';

export const renameXML = (ssdList: SSD[], oldPath: string) => {
    const pathes = getXMLDirPath();
    const path = pathes.ssd;
    const ssd = ssdList[ssdList.length - 1];

    const dateTime = DateTime.fromFormat(ssd.date, 'dd.MM.yyyy');
    // const suffix = dateTime.day === dateTime.daysInMonth ? '+' : '***';
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

    // // push ssd to icloud directory
    const newPath = `${path}SSD_${formatedDate}_${ssd.vessel_name}_${ssd.vessel_id}.xml`;
    fs.renameSync(oldPath, newPath);
};
