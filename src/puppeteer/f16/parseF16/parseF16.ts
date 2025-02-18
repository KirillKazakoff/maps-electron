import reportJson from '../../../filesDebug/reportNew.json';
import { parseInfo, SSDInfoT } from './parseInfo';
import { parseProdOutput, ProductionOutputT } from './parseProdOutput';
import { parseProdInput, ProductionInputT } from './parseProdInput';

export type ReportT = typeof reportJson;

export type ParsedSSDT = {
    info: SSDInfoT;
    production: {
        input: ProductionInputT[];
        output: {
            current: ProductionOutputT[];
            board: ProductionOutputT[];
        };
    };
};

export const parseF16 = (report: ReportT) => {
    // check if empty report; destructure variable
    if (!report?.Report?.Tablix1) return null;
    const { SSD_DATE_Collection } = report.Report.Tablix1[0];
    if (!SSD_DATE_Collection) return null;

    const { SSD_DATE } = SSD_DATE_Collection[0];

    // reduce and parse report
    const parsedSSD = SSD_DATE.reduce<ParsedSSDT[]>((total, json) => {
        const output = parseProdOutput(json);
        const input = parseProdInput(json);
        const info = parseInfo(json);

        total.push({ info, production: { input, output } });

        return total;
    }, []);

    return parsedSSD;
};
