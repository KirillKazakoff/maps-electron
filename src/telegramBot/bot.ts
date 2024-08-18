import { DateTime } from 'luxon';
import config from 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';
import TelegramBot from 'node-telegram-bot-api';
import { isDev } from '../utils/isDev';

const token = isDev() ? config.debugToken : config.token;

const botObj = new TelegramBot(token, { polling: true });

const sendAll = (text: string) => {
    config.chatId.forEach((id) => {
        botObj.sendMessage(id, text, { parse_mode: 'HTML' });
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

bot.botObj.on('message', (msg) => {
    console.log(msg.chat.id);
});

export const addIdListener = () => {
    bot.botObj.on('message', (msg) => {
        const chatId = msg.chat.id;
        console.log(chatId);
        if (msg.text.includes('ssd')) {
            bot.botObj.sendMessage(chatId, 'yes');
        }
    });
};

// prettier-ignore
export const sendReportVessels = (docName: string) => {
    bot.botObj.sendDocument(
        config.groupChatId[0],
        'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Отчеты для бота\\' + docName
    );
};

// sendReportVessels('Модель данных.pdf');

// if (navigator.keyboard)

addIdListener();
