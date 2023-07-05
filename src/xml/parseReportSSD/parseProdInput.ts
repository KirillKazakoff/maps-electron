import { SSDReportT } from './parseSSD';

export const parseProdInput = (id_ssd: string, ssdJson: SSDReportT) => {
    const initObj = { name: '', id_ssd: '', total: 0 };
    const pathToJson = ssdJson?.Subreport5[0]?.Report[0]?.Tablix8[0]?.Details6_Collection;
    if (!pathToJson) return initObj;

    const productionRawJson =
        pathToJson[0].Details6[0].Tablix2[0].Сведения_Collection[0].Сведения[0];

    const [name, id, totalAmount] = Object.values(productionRawJson).map((val) => val[0]);
    return { name, id_ssd, total: +totalAmount };
};
