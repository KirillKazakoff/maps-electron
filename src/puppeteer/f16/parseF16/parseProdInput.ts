import { ProductionInput } from '../../../api/models';
import { SSDReportT } from './parseSSD';

export const parseProdInput = (id_ssd: string, ssdJson: SSDReportT) => {
    const pathToJson = ssdJson?.Subreport1[0]?.Report[0]?.Tablix8[0];

    if (!pathToJson) return [];
    const productionRawJson =
        pathToJson.Details6_Collection[0].Details6[0].Tablix2[0].Сведения_Collection[0]
            .Сведения;

    const res = productionRawJson.reduce<ProductionInput[]>((total, input) => {
        const [name, id, totalAmount] = Object.values(input).map((val) => val[0]);

        total.push({ name, id_ssd, total: +totalAmount });
        return total;
    }, []);

    return res;
};
