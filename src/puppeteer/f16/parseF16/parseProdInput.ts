import { SSDReportT } from './parseInfo';

export type ProductionInputT = {
    name: string;
    total: number;
};

export const parseProdInput = (ssdJson: SSDReportT) => {
    try {
        const pathToJson = ssdJson?.Subreport1[0]?.Report[0]?.Tablix8[0];

        // check empty input
        if (!pathToJson || !pathToJson.Details6_Collection) return [];
        const detailsList = pathToJson.Details6_Collection[0].Details6;

        // go foreach row Details6 => go second array Сведения => push each prodInput
        const res = detailsList.reduce<ProductionInputT[]>((total, row) => {
            row.Tablix2[0].Сведения_Collection[0].Сведения.forEach((input) => {
                const [name, id, totalAmount] = Object.values(input).map((val) => val[0]);

                total.push({ name, total: +totalAmount });
            });

            return total;
        }, []);

        return res;
    } catch (e) {
        console.log(e);
    }
};
