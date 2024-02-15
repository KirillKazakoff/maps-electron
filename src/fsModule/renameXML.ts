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

    return fs.renameSync(
        oldPath,
        `${path}SSD_${formatedDate}_${ssd.vessel_name} ${suffix}.xml`
    );
};
