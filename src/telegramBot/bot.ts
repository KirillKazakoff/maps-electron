import { DateTime } from 'luxon';
import config from 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';
import TelegramBot from 'node-telegram-bot-api';
import { isDev } from '../utils/isDev';
import { getDateNow } from '../utils/date';
import fs from 'fs';
import { timePromise } from '../utils/time';

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

export const sendReportVessels = async (docName: string) => {
    // prettier-ignore
    const path = 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Отчеты для бота\\'
    const oldPath = path + docName;
    const newPath = `${path}Отчет от ${getDateNow()}.pdf`;

    fs.renameSync(oldPath, newPath);

    await timePromise(5000);
    bot.botObj.sendDocument(config.groupChatId[0], newPath);
};

// sendReportVessels('Модель данных.pdf');

// if (navigator.keyboard)

addIdListener();
