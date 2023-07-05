import { Bait } from '../../api/models';
import { SSDReportT } from './parseSSD';

export const parseBait = (id_ssd: string, ssdJson: SSDReportT) => {
    const detailsTotalJson = ssdJson.Tablix11[0].Details9_Collection[0].Details9;
    if (!detailsTotalJson) return [];

    const baitRecords = detailsTotalJson.filter((details) => {
        const type = details.Textbox208[0];
        return type.includes('для промпереработки');
    });

    return baitRecords.reduce<Bait[]>((total, record) => {
        const [name, id, amount] = Object.values(record).map((v) => v[0]);
        total.push({ id_ssd, name, total: +amount });
        return total;
    }, []);
};
