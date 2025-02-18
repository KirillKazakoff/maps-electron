import { SSDReportT } from './parseInfo';

export type ProductionOutputT = {
    name: string;
    total: number;
    sort: string;
};

const prodReplaceDictionary = {
    'икра минт яст мор зрел': 'икра минт ST',
    'икра минт яст мор пищ нестанд': 'икра минт',
};

const prodNameReplace = (name: string) => {
    let newName = name;

    Object.entries(prodReplaceDictionary).forEach(([key, value]) => {
        if (name.includes(key)) {
            console.log('KEY: ', key, '-----', 'VALUE: ', name);
            newName = value;
            console.log(newName);
        }
    });

    return newName;
};

const parseTable = (table: string | { [key: string]: string[] }[]) => {
    if (!table || typeof table === 'string') return [];

    return table.reduce<ProductionOutputT[]>((total, details) => {
        const resArr = Object.values(details).map((detail) => detail[0]);

        const [name, id, value, suffix, type] = resArr;

        if (!type.includes('вып. из собственного сырья')) return total;

        const nameArr = name.split(' ');
        const sort = nameArr.pop();
        const nameParsed = nameArr.join(' ');

        const obj: ProductionOutputT = {
            name: prodNameReplace(nameParsed),
            total: +value,
            sort,
        };
        total.push(obj);

        return total;
    }, []);
};

export const parseProdOutput = (ssdJson: SSDReportT) => {
    const detailsCurrentCollection = ssdJson.Tablix9[0]?.Details7_Collection[0];
    const detailsTotal = ssdJson.Tablix11[0].Details9_Collection[0].Details9;

    const output = {
        current: <ProductionOutputT[]>[],
        board: <ProductionOutputT[]>[],
    };

    if (detailsTotal) output.board = parseTable(detailsTotal);
    const isCurrent = typeof detailsCurrentCollection === 'object' && detailsCurrentCollection;

    if (isCurrent) {
        const detailsCurrent = Object.values(detailsCurrentCollection.Details7);
        output.current = parseTable(detailsCurrent);
    }

    return output;
};
