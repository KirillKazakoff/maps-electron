import { SSDReportT } from './parseInfo';

export type ProductionInputT = {
    name: string;
    total: number;
};

export const parseProdInput = (ssdJson: SSDReportT) => {
    const pathToJson = ssdJson?.Subreport1[0]?.Report[0]?.Tablix8[0];

    if (!pathToJson) return [];
    const productionRawJson =
        pathToJson.Details6_Collection[0].Details6[0].Tablix2[0].Сведения_Collection[0]
            .Сведения;

    const res = productionRawJson.reduce<ProductionInputT[]>((total, input) => {
        const [name, id, totalAmount] = Object.values(input).map((val) => val[0]);

        total.push({ name, total: +totalAmount });
        return total;
    }, []);

    return res;
};
