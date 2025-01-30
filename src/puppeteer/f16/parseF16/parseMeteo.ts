import { SSDReportT } from './parseInfo';
import { ProductionInputT } from './parseProdInput';

export const parseMeteo = (json: SSDReportT, input: ProductionInputT[]) => {
    const isMeteoDesc = json.Tablix5[0].Details3_Collection[0].Details3.some((details) => {
        return details.USED_TIME_DESCRIPTION2[0].includes('метео прост. на пром');
    });

    const isMeteo = isMeteoDesc && input.length === 0;
    return isMeteo;
};
