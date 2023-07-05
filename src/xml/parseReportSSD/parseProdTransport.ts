import { ProductionTransport } from '../../api/models';
import { groupify } from '../../utils/groupify';
import { SSDReportT } from './parseSSD';

type ProductionsTransport = { [key: string]: ProductionTransport };

export const parseProdTransport = (id_ssd: string, ssdJson: SSDReportT) => {
    const detailsTotalJson = ssdJson.Tablix11[0].Details9_Collection[0].Details9;
    if (!detailsTotalJson) return [];

    const prodRecords = detailsTotalJson.filter((details) => {
        const type = details.Textbox208[0];
        return type.includes('для транспортировки');
    });

    const prodTransportObj = prodRecords.reduce<ProductionsTransport>((total, record) => {
        const [name, id, amount] = Object.values(record).map((v) => v[0]);
        const splicedName = name.split(' ');
        splicedName.pop();
        const resName = splicedName.join(' ');

        const group = groupify<ProductionTransport>(
            total,
            { id_ssd, name: resName, total: 0 },
            resName,
        );
        group.total += +amount;

        return total;
    }, {});

    const res = Object.values(prodTransportObj);
    return res;
};
