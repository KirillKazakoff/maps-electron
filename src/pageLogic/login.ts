import { timePromise } from '../utils/time';
import { SettingsLoginT } from '../xml/settingsLogin';
import { browser } from '../browser';

export async function login(settings: SettingsLoginT) {
    try {
        const page = await browser.instance.newPage();
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

        await page.click('button.btn-danger');
        await timePromise(10000);

        console.log('on portal');

        await page.hover('.sub-navigation');
        await page.click('#id14');
        await timePromise(10000);
        await page.goto('https://mon.cfmc.ru');

        console.log('on ARM');
        return page;
    } catch (e) {
        console.log(e);
        // browser.instance.close();
    }
}
