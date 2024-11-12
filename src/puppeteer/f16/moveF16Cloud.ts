import { SSD } from '../../api/models';
import fs from 'fs';
import { getDirPathes } from '../fsModule/fsPathes';
import { DateTime } from 'luxon';

export const moveF16Cloud = (ssdList: SSD[], oldPath: string) => {
    const pathes = getDirPathes();
    const path = pathes.ssd;
    const ssd = ssdList[ssdList.length - 1];

    const dateTime = DateTime.fromFormat(ssd.date, 'dd.MM.yyyy');
    const formatedDate = dateTime.toFormat('yyyy-MM-dd');

    const cloudSSDNames = fs.readdirSync(`${getDirPathes().ssd}`, {
        withFileTypes: true,
    });

    //moveArchiveOnStartNewMonth
    const isStartMonth = DateTime.now().startOf('month').day === DateTime.now().day;

    if (isStartMonth) {
        cloudSSDNames.forEach((file) => {
            fs.renameSync(`${pathes.ssd}${file.name}`, `${pathes.archive}${file.name}`);
        });
    }

    // remove if same ssd vessel was before in directory
    const oldSSDNames = cloudSSDNames.filter((dirent) => {
        const id = dirent.name.split(/[_.]/)[3];
        return id === ssd.vessel_id;
    });

    if (!isStartMonth) {
        oldSSDNames.forEach((file) => {
            const filePath = `${path}${file.name}`;
            fs.unlinkSync(filePath);
        });
    }

    // // move ssd to icloud directory
    // prettier-ignore
    const newPath = `${path}SSD_${formatedDate}_${ssd.vessel_name.toUpperCase()}_${ssd.vessel_id}.xml`;
    fs.renameSync(oldPath, newPath);
};
