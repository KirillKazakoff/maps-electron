import { DateTime } from 'luxon';
import config from '../../config.json';
import TelegramBot from 'node-telegram-bot-api';

const botObj = new TelegramBot(config.token, { polling: true });

const sendAll = (text: string) => {
    config.chatId.forEach((id) => {
        botObj.sendMessage(id, text);
    });
};

const sendSSDLog = (text: string) => {
    const dateStr = DateTime.now().toFormat('dd-MM-yyyy');
    const msg = text + ' ' + dateStr;

    sendAll(msg);
};

export const bot = {
    botObj,
    sendAll,
    sendSSDLog,
};
