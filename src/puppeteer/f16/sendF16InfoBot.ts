import { settingsLogin } from '../fsModule/readConfig';
import { SSDObjectedT } from '../../api/models';
import { bot } from '../../telegramBot/bot';
import { SSDInfo } from './parseF16/parseF16';

export const sendF16InfoBot = (inputSSD: SSDInfo) => {
    console.log(inputSSD);
    const vesselsCompany = settingsLogin[1].vesselsId;
    const ssdList: SSDObjectedT[] = [];

    vesselsCompany.forEach((vessel) => {
        const ssdFiltered = inputSSD.ssd.filter((s) => s.vessel_id === vessel);
        const ssdInfo = ssdFiltered[ssdFiltered.length - 1];

        if (!ssdInfo) return;

        const input = inputSSD.productionInput.filter((s) => s.id_ssd === ssdInfo.id);

        const details = inputSSD.productionDetails.filter((s) => s.id_ssd === ssdInfo.id);

        const ssd = { ssdInfo, input, details };

        ssdList.push(ssd);
    });

    console.log(ssdList);
    ssdList.forEach((ssd) => {
        // prettier-ignore
        const {vessel_name, date, status} = ssd.ssdInfo;

        const detailsAll = ssd.details
            .map((d) => d.name + ' ' + d.sort + ' - ' + d.current + '\n')
            .join('');

        const detailsTotalAll = ssd.details
            .map((d) => d.name + ' ' + d.sort + ' - ' + d.total + '\n')
            .join('');

        const inputAll = ssd.input.map((i) => i.name + ' ' + i.total + '\n').join('');

        // prettier-ignore
        bot.sendLog(
`<b>${vessel_name}</b>
<i>${date} - ${status}\n</i>
${inputAll ? `<i>Вылов</i>
<code>${inputAll}</code>           
<i>Выпуск</i>
<code>${detailsAll}</code>
<i>Бортовая</i>
<code>${detailsTotalAll}</code>` : ''}
`       );
    });
};
