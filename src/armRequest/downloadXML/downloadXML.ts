import { browser } from '../browser';
import { setFunctionsInPageContext } from '../pageParse/setFunctionsInPageContext';

export const downloadXML = async (url: string) => {
    if (!browser.instance) return null;

    let intervalId: NodeJS.Timer;
    try {
        const page = await browser.instance.newPage();
        const functions = setFunctionsInPageContext(page);
        await page.goto(url);
        await new Promise((resolve, reject) => {
            intervalId = setInterval(async () => {
                if (!browser.instance) clearInterval(intervalId);

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
    } catch (e) {
        clearInterval(intervalId);
        console.log(e.message);

        if (e.message.includes('Отсутствует значение параметра')) {
            console.log('HHHHA');
            return false;
        }
        if (browser.instance) {
            browser.instance.close();
        }
        return false;
    }
};
