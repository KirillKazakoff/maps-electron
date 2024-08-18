import { bot } from '../../../telegramBot/bot';
import { browser } from '../browser';

export const onError = (intervalId: any, e: any) => {
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
};
