import reportJson from '../filesDebug/report.json';
import {
    ProductionInput,
    SSD,
    ProductionDetails,
    Reserve,
    Bait,
    ProductionTransport,
} from '../../api/models';
import { parseSSD } from './parseSSD';
import { parseDetails } from './parseDetails';
import { parseProdInput } from './parseProdInput';
import { parseReserve } from './parseReserve';
import { parseBait } from './parseBait';
import { parseProdTransport } from './parseProdTransport';

export type ReportT = typeof reportJson;

export const initSSDInfo = () => ({
    ssd: <SSD[]>[],
    productionDetails: <ProductionDetails[]>[],
    productionInput: <ProductionInput[]>[],
    productionTransport: <ProductionTransport[]>[],
    reserve: <Reserve[]>[],
    bait: <Bait[]>[],
});
export type SSDInfo = ReturnType<typeof initSSDInfo>;

export const parseReportSSD = (report: ReportT) => {
    const parsedObj = initSSDInfo();

    const { SSD_DATE_Collection } = report.Report.Tablix1[0];
    if (!SSD_DATE_Collection) return null;
    const { SSD_DATE } = SSD_DATE_Collection[0];

    return SSD_DATE.reduce<SSDInfo>((total, ssdJson) => {
        const { ssdParsed } = parseSSD(ssdJson);
        total.ssd.push(ssdParsed);

        const productionDetails = parseDetails(ssdJson, ssdParsed);
        total.productionDetails.push(...productionDetails);

        const productionInput = parseProdInput(ssdParsed.id, ssdJson);
        total.productionInput.push(productionInput);

        const productionTransport = parseProdTransport(ssdParsed.id, ssdJson);
        total.productionTransport.push(...productionTransport);

        const reserve = parseReserve(ssdParsed.id, ssdJson);
        total.reserve.push(reserve);

        const bait = parseBait(ssdParsed.id, ssdJson);
        total.bait.push(...bait);

        return total;
    }, parsedObj);
};
