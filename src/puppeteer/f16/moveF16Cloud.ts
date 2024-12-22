import { SSD } from '../../api/models';
import fs from 'fs';
import { getDirPathes } from '../fsModule/fsPathes';
import { DateTime } from 'luxon';

export const sliceSSDname = (str: string) => {
    const strParts = str.split('_');
    const id = strParts[3].split('.')[0];

    const fullDate = strParts[1];
    const [year, month, day] = fullDate.split('-');

    const composedId = `${year}-${month}_${id}`;

    return { composedId, id, year, month, day, src: str };
};

type SSDNameT = ReturnType<typeof sliceSSDname>;

export const moveF16Cloud = (ssdList: SSD[], oldPath: string) => {
    const pathes = getDirPathes();
    const ssd = ssdList[ssdList.length - 1];

    const dateTime = DateTime.fromFormat(ssd.date, 'dd.MM.yyyy');
    const formatedDate = dateTime.toFormat('yyyy-MM-dd');

    //moveArchiveOnStartNewMonth
    const isStartMonth = DateTime.now().startOf('month').day === DateTime.now().day;

    if (isStartMonth) {
        const archiveNames = fs
            .readdirSync(`${pathes.archive}`, { withFileTypes: true })
            .map((aName) => sliceSSDname(aName.name));
        const ssdNames = fs
            .readdirSync(`${pathes.ssd}`, { withFileTypes: true })
            .map((sName) => sliceSSDname(sName.name));

        // get most relevant ssd from last ssd folder
        const ssdToArchive = ssdNames.reduce<SSDNameT[]>((total, sName) => {
            const res = ssdNames.reduce((farestName, checkName) => {
                if (farestName.composedId !== checkName.composedId) return farestName;
                if (farestName.day < checkName.day) return checkName;
                return farestName;
            }, sName);

            // go next if same res in array
            if (total.some((nameInTotal) => nameInTotal.src === res.src)) return total;

            total.push(res);
            return total;
        }, []);

        // remove if same ssd occurs in archive
        const deleteArchive = archiveNames.filter((aName) => {
            const isSameInArchieve = ssdToArchive.some(
                (checkable) => checkable.composedId === aName.composedId
            );
            return isSameInArchieve;
        });

        deleteArchive.forEach((ssdName) => fs.unlinkSync(`${pathes.archive}${ssdName.src}`));

        // move ssd from ssd folder
        ssdToArchive.forEach((sName) => {
            fs.renameSync(`${pathes.ssd}${sName.src}`, `${pathes.archive}${sName.src}`);
        });
    }

    // // move ssd from download dir to icloud dir
    // prettier-ignore
    const newPath = `${pathes.ssd}SSD_${formatedDate}_${ssd.vessel_name.toUpperCase()}_${ssd.vessel_id}.xml`;
    fs.renameSync(oldPath, newPath);
};
