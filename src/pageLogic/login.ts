import puppeteer from 'puppeteer';
import { api } from '../api/api';
import { timePromise } from '../utils/time';
import { SettingsLoginT } from '../xml/settingsLogin';

export async function loginOsm(settings: SettingsLoginT) {
    const browser = await puppeteer.launch({ devtools: true, headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(50000);

    await page.goto('https://osm.gov.ru/portal/login');
    console.log('login');

    await page.evaluate((s) => {
        const inputs = {
            login: <HTMLInputElement>document.getElementById('id4'),
            password: <HTMLInputElement>document.getElementById('id5'),
        };

        inputs.login.value = s.login;
        inputs.password.value = s.password;
    }, settings);

    const vesselsId = await api.get.vesselsByCompany(settings.companyId);

    await page.click('button.btn-danger');
    await timePromise(18000);

    console.log('on portal');

    await page.hover('.sub-navigation');
    await page.click('#id14');
    await timePromise(12000);

    console.log('on ARM');
    return { browser, vesselsId, page };
}