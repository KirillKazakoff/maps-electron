import { ProductionDetails, SSD } from '../../../api/models';
import { SSDReportT } from './parseSSD';

export const parseDetails = (ssdJson: SSDReportT, ssdParsed: SSD) => {
    const detailsCurrentJson = ssdJson.Tablix9[0]?.Details7_Collection[0]?.Details7;
    const detailsTotalJson = ssdJson.Tablix11[0].Details9_Collection[0].Details9;
    if (!detailsCurrentJson) return [];

    // for vessel-catcher
    return detailsCurrentJson.reduce<ProductionDetails[]>((total, details) => {
        const [name, id, current, suffix, type] = Object.values(details).map(
            (detail) => detail[0]
        );
        if (!type.includes('вып. из собственного сырья')) return total;

        let totalCount = detailsTotalJson
            ? detailsTotalJson.find((dt) => dt.Textbox64[0] === name)?.Textbox109[0]
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
};
