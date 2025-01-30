import { bot } from '../../telegramBot/bot';
import { ParsedSSDT } from './parseF16/parseF16';
import { DateTime } from 'luxon';

export const sendF16InfoBot = (f16Array: ParsedSSDT[][]) => {
    const lastSSD = f16Array.map((f16) => f16[f16.length - 1]);

    const infoReport = lastSSD.reduce((total, ssd) => {
        const { vessel_name, date, destination, isMeteo } = ssd.info;
        let { status } = ssd.info;
        const { input, output } = ssd.production;

        const outputCurrent = output
            .map((d) => d.name + '\n' + d.sort + ' - ' + d.current + ' тн.' + '\n')
            .join('');

        const outputOnBoard = output
            .map((d) => d.name + '\n' + d.sort + ' - ' + d.total + ' тн.' + '\n')
            .join('');

        let inputTotal = input.map((i) => i.name + ' ' + i.total + ' тн.' + '\n').join('');
        const totalInputCount = input.reduce<number>((total, i) => total + +i.total, 0);
        if (!totalInputCount) inputTotal = '';

        let destinationStr = '';
        if (status === 'СЛЕДУЕТ В ПОРТ' || status === 'СЛЕДУЕТ НА ПРОМЫСЕЛ') {
            destinationStr = destination.placeName + '\nETA: ' + destination.eta;
        }
        if (status === 'В ПОРТУ' || status === 'НА ПРОМЫСЛЕ') {
            destinationStr = destination.placeName;
        }

        // check date outdate
        const dateYesterday = DateTime.now().minus({ day: 1 }).toFormat('dd.MM.yyyy');
        const isOutdated = dateYesterday !== ssd.info.date;

        // check meteo
        if (isMeteo) status = `${status} (ПРОСТОИ МЕТЕО)`;

        // prettier-ignore
        const reportStr = `
<b>${vessel_name}</b> ${isOutdated ? '\n(НЕТ НОВЫХ ССД)' : ''}
<i>${date} - ${status}</i> 
<i>${destinationStr}</i>
${inputTotal ? `\n<i>Вылов\n</i><code>${inputTotal}</code>` : ''}${inputTotal ? `\n<i>Выпуск\n</i><code>${outputCurrent}</code>` : ''}${outputOnBoard ? `\n<i>Бортовая\n</i><code>${outputOnBoard}</code>` : ''} \n\n`;

        total += reportStr;
        return total;
    }, '');

    bot.sendLogGroup(infoReport);
};
