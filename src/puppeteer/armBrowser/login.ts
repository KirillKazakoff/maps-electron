import { SettingsT } from '../../utils/types';
import { bot } from '../../bot/bot';
import { timePromise } from '../../utils/time';
import { browser } from '../browser';

export async function login(settings: SettingsT) {
    try {
        await browser.launch();
        const page = await browser.instance.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.goto('https://osm.gov.ru/portal/login');

        await page.evaluate((s) => {
            const inputs = {
                login: <HTMLInputElement>document.getElementById('id4'),
                password: <HTMLInputElement>document.getElementById('id5'),
            };

            inputs.login.value = s.login;
            inputs.password.value = s.password;
        }, settings);

        await page.click('button.btn-danger');
        await timePromise(5000);

        const url = page.url();
        console.log(url);

        if (
            url === 'https://osm.gov.ru/fishery/loginRedirect' ||
            url === 'https://osm.gov.ru/portal/wicket/page?13'
        ) {
            await page.evaluate((s) => {
                const inputs = {
                    login: <HTMLInputElement>document.getElementById('id3'),
                    password: <HTMLInputElement>document.getElementById('id4'),
                };

                inputs.login.value = s.login;
                inputs.password.value = s.password;
            }, settings);

            page.click('button.btn-danger');
            await timePromise(10000);

            page.click('.icon-home.chart');
            await timePromise(10000);
        } else {
            await timePromise(10000);
            await page.hover('.sub-navigation');
            await page.click('#id14');
            await timePromise(10000);
        }

        console.log('on ARM');
        return page;
    } catch (e) {
        // relaunch
        await browser.clear(null, true);
        bot.log.bot('Error on OSM Login: ' + e.message);
        await login(settings);

        return false;
    }
}
