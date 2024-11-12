import { DateTime } from 'luxon';
import config from 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';
import TelegramBot from 'node-telegram-bot-api';
import { isDev } from '../puppeteer/fsModule/isDev';
import { getDateNow } from '../utils/date';
import fs from 'fs';
import { timePromise } from '../utils/time';

const token = isDev() ? config.debugToken : config.token;

const botObj = new TelegramBot(token, { polling: true });

const sendLog = (text: string) => {
    config.chatId.forEach((id) => {
        botObj.sendMessage(id, text, { parse_mode: 'HTML' });
    });
};

const sendSSDLog = (text: string) => {
    const dateStr = DateTime.now().toFormat('dd-MM-yyyy');
    const msg = text + ' ' + dateStr;

    sendLog(msg);
};

export const bot = {
    botObj,
    sendLog,
    sendSSDLog,
};

export const addIdListener = () => {
    bot.botObj.on('message', (msg) => {
        console.log(msg);
        const chatId = msg.chat.id;
        console.log(chatId);
        console.log(msg.message_thread_id);

        if (msg.text.includes('ssd')) {
            bot.botObj.sendMessage(chatId, 'yes');
        }
    });
};

export const sendReport = async (
    type: 'vessel' | 'quotes' | 'fish' | 'tech' | 'crab',
    docName: string
) => {
    try {
        // prettier-ignore
        const path = 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Отчеты для бота\\'
        const oldPath = path + docName + '.pdf';

        let suffix = '';
        if (type === 'quotes') suffix = 'по квотам';
        if (type === 'vessel') suffix = 'по судам';
        if (type === 'tech') suffix = 'технический';
        if (type === 'fish') suffix = 'по минтаю сельди';
        if (type === 'crab') suffix = 'по выпуску краба';

        const newPath = `${path}Отчет ${suffix} от ${getDateNow()}.pdf`;

        const fileSize = fs.readFileSync(oldPath).byteLength;
        if (fileSize / 1024 < 85) {
            throw new Error('empty report');
        }
        fs.renameSync(oldPath, newPath);

        await timePromise(10000);
        let chatId = 0;

        if (isDev()) {
            chatId = config.chatId[0];
        } else {
            chatId = config.groupChatId.channel;
        }

        if (type === 'tech') {
            chatId = config.groupChatId.debug;
        }

        bot.botObj.sendDocument(chatId, newPath);
        await timePromise(1000);
    } catch (e) {
        if (e.message === 'empty report') {
            bot.sendLog('empty report ' + docName.toUpperCase());
            return;
        }

        console.log(e.message);
        bot.sendLog('error on send document ' + docName.toUpperCase() + '- ' + e.message);
    }
};

addIdListener();
