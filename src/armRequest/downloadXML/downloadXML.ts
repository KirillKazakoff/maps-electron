import { bot } from '../../telegramBot/bot';
import { browser } from '../browser';
import { setFunctionsInPageContext } from '../pageParse/setFunctionsInPageContext';

export const downloadXML = async (url: string, timers: NodeJS.Timer[]) => {
    if (!browser.instance) return null;

    let intervalId: NodeJS.Timer;
    try {
        const page = await browser.instance.newPage();
        const functions = setFunctionsInPageContext(page);
        await page.goto(url);
        await new Promise((resolve, reject) => {
            let timeWait = 0;

            intervalId = setInterval(async () => {
                timeWait += 2000;

                if (!browser.instance) {
                    clearInterval(intervalId);
                    return;
                }
                if (timeWait > 150000) {
                    clearInterval(intervalId);
                    reject(new Error('wait too much'));
                }

                console.log('check page');
                const isSpan = await functions.selectSpan();
                const liError = await functions.checkLiNoValue();

                console.log(liError);
                if (liError) {
                    reject(new Error(liError));
                }

                if (isSpan) {
                    resolve('ready');
                    clearInterval(intervalId);
                }
            }, 2000);
        });

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
