import { SSD } from '../api/models';
import fs from 'fs';
import { getXMLDirPath } from './fsUtils';
import { DateTime } from 'luxon';

export const renameXML = (ssdList: SSD[], oldPath: string) => {
    const path = getXMLDirPath().ssd;
    const ssd = ssdList[ssdList.length - 1];

    const dateTime = DateTime.fromFormat(ssd.date, 'dd.MM.yyyy');
    const suffix = dateTime.day === dateTime.daysInMonth ? '+' : '***';
    const formatedDate = dateTime.toFormat('yyyy-MM-dd');

    // remove if same ssd vessel was before in directory
    const cloudSSDNames = fs.readdirSync(`${getXMLDirPath().ssd}`, {
        withFileTypes: true,
    });

    const file = cloudSSDNames.find((dirent) => {
        const id = dirent.name.split('_')[3];
        return id === ssd.vessel_id;
    });

    if (file?.name) {
        const filePath = `${path}${file.name}`;
        // console.log(filePath);
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        });
    }

    // push ssd to icloud directory
    fs.renameSync(
        oldPath,
        `${path}SSD_${formatedDate}_${ssd.vessel_name}_${ssd.vessel_id}_${suffix}.xml`
    );
};
