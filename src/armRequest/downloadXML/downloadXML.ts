import { bot } from '../../telegramBot/bot';
import { browser } from '../browser';
import { waitReportLoad } from './waitReportLoad';

export const downloadXML = async (url: string, timers: NodeJS.Timer[]) => {
    if (!browser.instance) return null;

    let intervalId: NodeJS.Timer;
    try {
        const page = await browser.instance.newPage();
        await page.goto(url);
        await waitReportLoad({ intervalId, browser, page });

        const selectorMenu = '#ReportViewer1_ctl05_ctl04_ctl00';
        const selectorXMLOption = 'a[title="XML-файл с данными отчета"]';
        await page.click(selectorMenu);
        await page.click(selectorXMLOption);

        timers.push(setTimeout(() => page.close(), 20000));
    } catch (e) {
        clearInterval(intervalId);
        console.log(e.message);

        // error_restart

        const errorsRestart = [
            'calls for a higher timeout if needed',
            'User',
            'Session closed. Most likely the page has been closed',
            'Runtime.callFunctionOn timed out',
            'errorProtocol error (Target.createTarget)',
            'errorNavigation failed because browser has disconnected',
            'Requesting main frame too early!',
            'wait too much',
        ];

        errorsRestart.forEach((option) => {
            if (e.message.includes(option)) {
                throw new Error('error_restart');
            }
        });

        if (e.message.includes('Отсутствует значение параметра')) {
            console.log('No param found');
            return false;
        }

        bot.sendAll('error' + e.message);

        if (browser.instance) {
            browser.instance.close();
        }
        return false;
    }
};
