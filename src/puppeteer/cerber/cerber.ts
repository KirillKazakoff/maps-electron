import { timePromise } from '../../utils/time';
import { browser } from '../browser';
import { getConfig } from '../fsModule/readConfig';
import { setFunctionsInPageContext } from '../setFunctionsInPageContext';
import { waitCerberLoad } from './waitCerberLoad';
import fs from 'fs';

export const cerber = async () => {
    let intervalId: null;
    const { cerberList } = getConfig();

    await browser.launch();
    const page = await browser.instance.newPage();

    await page.goto('https://cerberus.vetrf.ru/cerberus/certified/exporter/pub');

    await waitCerberLoad({ browser, page, intervalId });

    const statuses: string[][] = [];
    for await (const id of cerberList) {
        await page.evaluate((value) => {
            const input = document.getElementById('objectNumbers') as HTMLInputElement;
            input.value = value;
        }, id);

        await timePromise(2000);

        await page.click('#searchBtn');

        await timePromise(2000);

        const functions = setFunctionsInPageContext(page);
        const status = await functions.getCerberStatus(id);

        statuses.push(status);

        await timePromise(1000);
    }

    const dataCSV = statuses.reduce<string>((total, status) => {
        const [id, value, date, country] = status;

        let countryEng = '';
        if (country === 'Китай') countryEng = 'China';
        if (country === 'Япония') countryEng = 'Japan';
        if (country === 'Корея, Республика') countryEng = 'Korea';

        total += `${id}, ${value}, ${date || '0'}, ${countryEng}\n`;
        return total;
    }, 'ID, status, date, country\n');

    fs.writeFileSync('C:\\Users\\admin\\Downloads\\statuses.csv', dataCSV);
    console.log('statuses were written into csv');
};
