import { vessels } from '../fsModule/readConfig';
import { SSDObjectedT } from '../../api/models';
import { bot } from '../../telegramBot/bot';
import { SSDInfo } from './parseF16/parseF16';
import { DateTime } from 'luxon';

export const sendF16InfoBot = (inputSSD: SSDInfo) => {
    const ssdList: SSDObjectedT[] = [];

    vessels.company.forEach((vessel) => {
        const ssdFiltered = inputSSD.ssd.filter((s) => s.vessel_id === vessel);
        const ssdInfo = ssdFiltered[ssdFiltered.length - 1];

        if (!ssdInfo) return;

        const input = inputSSD.productionInput.filter((s) => s.id_ssd === ssdInfo.id);

        const details = inputSSD.productionDetails.filter((s) => s.id_ssd === ssdInfo.id);

        const ssd = { ssdInfo, input, details };

        ssdList.push(ssd);
    });

    // console.log(ssdList);

    const infoReport = ssdList.reduce((total, ssd) => {
        const { vessel_name, date, status, destination } = ssd.ssdInfo;

        const detailsAll = ssd.details
            .map((d) => d.name + '\n' + d.sort + ' - ' + d.current + ' тн.' + '\n')
            .join('');

        const detailsTotalAll = ssd.details
            .map((d) => d.name + '\n' + d.sort + ' - ' + d.total + ' тн.' + '\n')
            .join('');

        let inputAll = ssd.input.map((i) => i.name + ' ' + i.total + ' тн.' + '\n').join('');
        const totalInputCount = ssd.input.reduce<number>((total, i) => total + +i.total, 0);
        if (!totalInputCount) inputAll = '';

        let destinationStr = '';
        if (status === 'СЛЕДУЕТ В ПОРТ' || status === 'СЛЕДУЕТ НА ПРОМЫСЕЛ') {
            destinationStr = destination.placeName + '\nETA: ' + destination.eta;
        }
        if (status === 'В ПОРТУ' || status === 'НА ПРОМЫСЛЕ') {
            destinationStr = destination.placeName;
        }

        // checkDateOutdate Fn
        const dateYesterday = DateTime.now().minus({ day: 1 }).toFormat('dd.MM.yyyy');
        const isOutdated = dateYesterday !== ssd.ssdInfo.date;

        // prettier-ignore
        const reportStr = `
<b>${vessel_name}</b> ${isOutdated ? '(\nСТАРАЯ ДАТА ССД)' : ''}
<i>${date} - ${status}</i> 
<i>${destinationStr}</i>
${inputAll ? `\n<i>Вылов\n</i><code>${inputAll}</code>` : ''}${inputAll ? `\n<i>Выпуск\n</i><code>${detailsAll}</code>` : ''}${detailsTotalAll ? `\n<i>Бортовая\n</i><code>${detailsTotalAll}</code>` : ''} \n\n`;

        total += reportStr;
        return total;
    }, '');

    bot.sendLogGroup(infoReport);
};
