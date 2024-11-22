/* eslint-disable no-useless-escape */
import { SSD } from '../../../api/models';
import { ReportT } from './parseF16';

// eslint-disable-next-line no-useless-escape
const rgBracket = /[\(\)]/;
export type SSDReportT =
    ReportT['Report']['Tablix1'][0]['SSD_DATE_Collection'][0]['SSD_DATE'][0];

export const parseSSD = (ssd: SSDReportT) => {
    const header = ssd.Textbox33[0];
    const destinationReg = ssd.Textbox4[0].split(
        /(пункт следования).([\- \d]+)(.+)(ож. приход).([\d{2}\.]+).(.+)/
    );

    const destination = {
        port: destinationReg[3],
        eta: destinationReg[5],
    };

    const headerSpaced = header.split(' ');
    const date = headerSpaced[0];
    const vessel_id = header.split(rgBracket)[1];

    const name = header.split(rgBracket)[0].substring(10, 100).trim();

    const id = date + vessel_id;

    const agreementStr = headerSpaced[headerSpaced.indexOf('№') + 1].split('\r\n');
    const agreement_no = agreementStr[0];
    const catch_zone_id = agreementStr[1];

    const company_id = header.split('__/')[1].match(/[0-9]+/)?.[0];
    if (!company_id) throw new Error('cant parse company ID');

    const coordinates = header.split(' ').reduce<string>((totalC, str, i) => {
        if (str.includes('°')) {
            totalC += str.split('°').join('.').slice(0, -1);
            if (i !== header.length) totalC += ' ';
        }
        return totalC;
    }, '');

    // statusParsed
    const statusToken = headerSpaced[headerSpaced.length - 1].toLocaleLowerCase();
    let status = 'НЕИЗВЕСТЕН';
    if (statusToken === 'промысле') status = 'НА ПРОМЫСЛЕ';
    if (statusToken === 'промысел') status = 'СЛЕДУЕТ НА ПРОМЫСЕЛ';
    if (statusToken === 'порту') status = 'В ПОРТУ';
    if (statusToken === 'порт') status = 'СЛЕДУЕТ В ПОРТ';

    const isTransport = headerSpaced[9] === 'ТР';

    const ssdParsed: SSD = {
        id,
        date,
        vessel_name: name,
        vessel_id,
        company_id,
        agreement_no,
        catch_zone_id,
        coordinates,
        status,
        destination,
    };

    return { ssdParsed, isTransport };
};
