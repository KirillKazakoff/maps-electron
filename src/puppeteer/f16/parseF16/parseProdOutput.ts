import { SSDReportT } from './parseInfo';

export type ProductionOutputT = {
    name: string;
    current: number;
    total: number;
    sort: string;
};

export const parseProdOutput = (ssdJson: SSDReportT) => {
    const detailsCurrentCollection = ssdJson.Tablix9[0]?.Details7_Collection[0];
    const detailsTotal = ssdJson.Tablix11[0].Details9_Collection[0].Details9;

    let res: ProductionOutputT[] = [];

    if (!detailsCurrentCollection) {
        if (!detailsTotal) return [];

        res = detailsTotal.reduce<ProductionOutputT[]>((total, details) => {
            const resArr = Object.values(details).map((detail) => detail[0]);

            const [name, id, current, suffix, type] = resArr;

            if (!type.includes('вып. из собственного сырья')) return total;

            const nameArr = name.split(' ');
            const sort = nameArr.pop();
            const nameParsed = nameArr.join(' ');

            const obj: ProductionOutputT = {
                name: nameParsed,
                current: 0,
                total: +current,
                sort,
            };
            total.push(obj);

            return total;
        }, []);

        return res;
    }

    if (typeof detailsCurrentCollection === 'string') return [];
    if (!detailsCurrentCollection) return [];

    const detailsCurrent = Object.values(detailsCurrentCollection.Details7);

    // for vessel-catcher
    res = detailsCurrent.reduce<ProductionOutputT[]>((total, details) => {
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

        const obj: ProductionOutputT = {
            name: nameParsed,
            current: +current,
            total: totalCount,
            sort,
        };
        total.push(obj);

        return total;
    }, []);

    return res;
};
