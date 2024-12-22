/* eslint-disable no-useless-escape */
import { SSD } from '../../../api/models';
import { ReportT } from './parseF16';

// eslint-disable-next-line no-useless-escape
const rgBracket = /[\(\)]/;
export type SSDReportT =
    ReportT['Report']['Tablix1'][0]['SSD_DATE_Collection'][0]['SSD_DATE'][0];

export const parseSSD = (ssd: SSDReportT) => {
    const header = ssd.Textbox33[0];

    const headerSpaced = header.split(' ');

    // statusParsed
    const statusToken = headerSpaced[headerSpaced.length - 1].toLocaleLowerCase();
    let status = 'НЕИЗВЕСТЕН';
    let placeName = '';
    const destinationReg = ssd.Textbox4[0].split(
        /(пункт следования).([\- \d]+)(.+)(ож. приход).([\d{2}\.]+).(.+)/
    );

    if (statusToken === 'промысле') {
        status = 'НА ПРОМЫСЛЕ';
        placeName = header.split(' - ')[1].split('°')[0].slice(0, -3);
    }
    if (statusToken === 'промысел') {
        status = 'СЛЕДУЕТ НА ПРОМЫСЕЛ';
        placeName = destinationReg[3];
    }
    if (statusToken === 'порту') {
        status = 'В ПОРТУ';
        placeName = header.split(' - ')[1].split('°')[0].slice(0, -3);
    }
    if (statusToken === 'порт') {
        status = 'СЛЕДУЕТ В ПОРТ';
        placeName = destinationReg[3];
    }

    const destination = {
        eta: destinationReg[5],
        placeName,
    };

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
