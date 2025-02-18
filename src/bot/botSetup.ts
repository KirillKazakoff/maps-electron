import TelegramBot from 'node-telegram-bot-api';
import { isDev } from '../puppeteer/fsModule/isDev';
import { getConfig } from '../puppeteer/fsModule/readConfig';

const config = getConfig();

if (isDev()) {
    config.token = config.debugToken;
    // each message goes to dev chat
    Object.values(config.chat).forEach((chat) => {
        chat.id = config.chat.bot.id;
    });
}

export const botSetup = {
    api: new TelegramBot(config.token, { polling: true }),
    chat: config.chat,
};

botSetup.api.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId, msg.message_thread_id);
});
