import { ProductionDetails, SSD } from '../../../api/models';
import { SSDReportT } from './parseSSD';

export const parseDetails = (ssdJson: SSDReportT, ssdParsed: SSD) => {
    const detailsCurrentCollection = ssdJson.Tablix9[0]?.Details7_Collection[0];

    if (typeof detailsCurrentCollection === 'string') return [];
    if (!detailsCurrentCollection) return [];

    const detailsTotal = ssdJson.Tablix11[0].Details9_Collection[0].Details9;
    const detailsCurrent = Object.values(detailsCurrentCollection.Details7);

    console.log(detailsCurrent);
    // for vessel-catcher
    const res = detailsCurrent.reduce<ProductionDetails[]>((total, details) => {
        const resArr = Object.values(details).map((detail) => detail[0]);

        const [name, id, current, suffix, type] = resArr;

        if (!type.includes('вып. из собственного сырья')) return total;

        let totalCount = detailsTotal
            ? detailsTotal.find((dt) => dt.Textbox64[0] === name)?.Textbox109[0]
            : 0;
        if (!totalCount) totalCount = 0;
        totalCount = +totalCount;

        const nameArr = name.split(' ');
        const sort = nameArr.pop();
        const nameParsed = nameArr.join(' ');

        const obj: ProductionDetails = {
            id_ssd: ssdParsed.id,
            name: nameParsed,
            current: +current,
            total: totalCount,
            sort,
        };
        total.push(obj);

        return total;
    }, []);

    console.log('parse details check');
    console.log(res);

    return res;
};
