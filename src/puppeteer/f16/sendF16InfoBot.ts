import { bot } from '../../bot/bot';
import { ParsedSSDT } from './parseF16/parseF16';

export const sendF16InfoBot = (f16Array: ParsedSSDT[][]) => {
    const lastSSD = f16Array.map((f16) => f16[f16.length - 1]);
    const sortedSSD = lastSSD.sort((prev, next) => {
        if (next.info.isOutdated || next.info.status.main === 'НЕИЗВЕСТЕН') {
            return -1;
        }
    });

    const infoReport = sortedSSD.reduce((total, ssd) => {
        const { vessel_name, date, isOutdated, trapData } = ssd.info;
        const { main, place, event: eventArray, destination } = ssd.info.status;
        const { input, output } = ssd.production;

        // prettier-ignore
        const outputCurrent = output.current
            .map((d) => `${d.name} ${d.sort} - ${d.total} тн.${d.coefficient > 0 ? ` (Коэффициент выпуска: ${d.coefficient}%)` : ''}\n`)
            .join('');

        const outputOnBoard = output.board
            .map((d) => `${d.name} ${d.sort} - ${d.total} тн.\n`)
            .join('');

        // input production description
        let inputTotal = input.map((i) => `${i.name} ${i.total} тн.\n`).join('');
        const totalInputCount = input.reduce<number>((total, i) => total + +i.total, 0);
        if (!totalInputCount) inputTotal = '';

        // trap info description
        let trapStr = '';
        if (trapData) {
            trapStr = trapData.map((t) => `${t.desc}: ${t.amountStr}\n`).join('');
        }

        // event time list description
        const event = eventArray.reduce<string>((total, e, i) => {
            total += `${e.type} - ${e.time.toFixed(1)}ч`;
            if (i !== total.length - 1) total += '\n';
            return total;
        }, '');

        // object with checks
        const is = {
            event: event && !event.includes('НЕ ОПРЕДЕЛЕН'),
            going: main === 'СЛЕДУЕТ В ПОРТ' || main === 'СЛЕДУЕТ НА ПРОМЫСЕЛ',
            staying: main === 'В ПОРТУ' || main === 'НА ПРОМЫСЛЕ',
            input: inputTotal,
            onBoard: outputOnBoard,
        };

        // prettier-ignore
        const msg = {  
            vessel: `${vessel_name}`,
            outdated: isOutdated ? '\n(НЕТ НОВЫХ ССД)' : '',
            status: `${date} - ${main}`,
            destination: is.going ? `\n${place}\nПункт следования: ${destination.place}\nETA: ${destination.eta}` : is.staying ? `\n${place}` : '',
    
            // body
            event: is.event ? `\n\n<b>Операции:</b>\n<i>${event}</i>` : '',
            input: is.input ? `<b>Вылов:\n</b><i>${inputTotal}${trapStr}</i>` : '',
            output: is.input ? `\n<b>Выпуск:\n</b><i>${outputCurrent}</i>` : '',
            onBoard: is.onBoard ? `\n<b>Бортовая:\n</b><i>${outputOnBoard}</i>` : '',
            separator: isOutdated || main === 'НЕИЗВЕСТЕН' ? '' : '\n\n',
        }

        // prettier-ignore
        const reportStr = `
<b>${msg.vessel}</b>
<b>${msg.status}</b><i>${msg.outdated}</i><b>${msg.destination}</b>${msg.event}
${msg.input}${msg.output}${msg.onBoard}${msg.separator}`;

        total += reportStr;
        return total;
    }, '');

    bot.log.reports(infoReport);
};
