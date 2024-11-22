import { vessels } from '../fsModule/readConfig';
import { SSDObjectedT } from '../../api/models';
import { bot } from '../../telegramBot/bot';
import { SSDInfo } from './parseF16/parseF16';

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

    console.log(ssdList);

    const infoReport = ssdList.reduce((total, ssd) => {
        const { vessel_name, date, status, destination } = ssd.ssdInfo;

        const detailsAll = ssd.details
            .map((d) => d.name + '\n' + d.sort + ' - ' + d.current + '\n')
            .join('');

        const detailsTotalAll = ssd.details
            .map((d) => d.name + '\n' + d.sort + ' - ' + d.total + '\n')
            .join('');

        const inputAll = ssd.input.map((i) => i.name + ' ' + i.total + '\n').join('');
        const destinationStr =
            status === 'СЛЕДУЕТ В ПОРТ' ? destination.port + '\nETA: ' + destination.eta : '';
        const isLastEnter = detailsTotalAll[detailsTotalAll.length - 1] === '\n';

        // prettier-ignore
        const reportStr = `
<b>${vessel_name}</b>
<i>${date} - ${status}</i>
<i>${destinationStr}</i>
${inputAll ? `<i>Вылов</i>
<code>${inputAll}</code>` : ''}
${detailsAll ? `<i>Выпуск</i>
<code>${detailsAll}</code>` : ''}
${detailsTotalAll ? `<i>Бортовая</i>
<code>${detailsTotalAll}</code>\n\n` : ''} ${isLastEnter ? '' : '\n\n'}`;

        total += reportStr;
        return total;
    }, '');

    bot.sendLogGroup(infoReport);
};
