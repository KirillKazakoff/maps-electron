import TelegramBot from 'node-telegram-bot-api';
import { isDev } from '../puppeteer/fsModule/isDev';
import { getConfig } from '../puppeteer/fsModule/readConfig';
import { app } from 'electron';
import { timePromise } from '../utils/time';

const config = getConfig();

if (isDev()) {
    // each chat goes to dev chat
    config.token = config.debugToken;

    Object.values(config.chat).forEach((chat) => {
        chat.id = config.chat.bot.id;
    });
}

export const botSetup = {
    api: new TelegramBot(config.token, { polling: true }),
    chat: config.chat,
};

botSetup.api.on('message', async (msg) => {
    console.log(msg.chat.id, msg.message_thread_id);
    await timePromise(9000);

    if (msg.text.includes('app.restart')) {
        app.relaunch();
        app.exit();
    }
});
