import { DateTime } from 'luxon';
import { getDirPathes } from '../fsModule/fsPathes';
import fs from 'fs';
import { ParsedSSDT } from './parseF16/parseF16';

export const moveF16Cloud = (ssdList: ParsedSSDT[], oldPath: string) => {
    const pathes = getDirPathes();
    const path = pathes.ssd;
    const ssd = ssdList[ssdList.length - 1];

    const dateTime = DateTime.fromFormat(ssd.info.date, 'dd.MM.yyyy');
    const formatedDate = dateTime.toFormat('yyyy-MM-dd');

    const cloudSSDNames = fs.readdirSync(`${getDirPathes().ssd}`, {
        withFileTypes: true,
    });

    //moveArchiveOnStartNewMonth
    // const isStartMonth = DateTime.now().startOf('month').day === DateTime.now().day;

    // if (isStartMonth) {
    //     cloudSSDNames.forEach((file) => {
    //         fs.renameSync(`${pathes.ssd}${file.name}`, `${pathes.archive}${file.name}`);
    //     });
    // }

    // remove if same ssd vessel was before in directory
    const oldSSDNames = cloudSSDNames.filter((dirent) => {
        const id = dirent.name.split(/[_.]/)[3];
        return id === ssd.info.vessel_id;
    });

    // if (!isStartMonth) {
    oldSSDNames.forEach((file) => {
        const filePath = `${path}${file.name}`;
        fs.unlinkSync(filePath);
    });
    // }

    // // move ssd to icloud directory
    const { vessel_id, vessel_name } = ssd.info;
    const newPath = `${path}SSD_${formatedDate}_${vessel_name.toUpperCase()}_${vessel_id}.xml`;
    fs.renameSync(oldPath, newPath);

    console.log('ssd have been sent to the Cloud');
};
