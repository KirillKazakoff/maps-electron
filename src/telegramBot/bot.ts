import { DateTime } from 'luxon';
import config from 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';
import TelegramBot from 'node-telegram-bot-api';
import { isDev } from '../puppeteer/fsModule/isDev';
import { getDateNow } from '../utils/date';
import fs from 'fs';
import { timePromise } from '../utils/time';

const token = isDev() ? config.debugToken : config.token;
const channelId = isDev() ? config.chatId[0] : config.groupChatId.channel;

const botObj = new TelegramBot(token, { polling: true });

const sendLog = (text: string | number) => {
    config.chatId.forEach((id) => {
        botObj.sendMessage(id, text.toString(), { parse_mode: 'HTML' });
    });
};

const sendLogDated = (text: string) => {
    const dateStr = DateTime.now().toFormat('dd-MM-yyyy');
    const msg = text + ' ' + dateStr;

    sendLog(msg);
};

const sendLogGroup = (text: string) => {
    botObj.sendMessage(channelId, text, { parse_mode: 'HTML' });
};

export const bot = {
    botObj,
    sendLog,
    sendLogDated,
    sendLogGroup,
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
    type: 'vessel' | 'quotes' | 'fish' | 'tech' | 'crab' | 'f19Querry',
    docName: string,
    ext: 'pdf' | 'xlsx'
) => {
    try {
        // prettier-ignore
        // add suffix for path report
        const path = 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Отчеты для бота\\'
        const oldPath = path + docName + `.${ext}`;

        let suffix = '';
        if (type === 'quotes') suffix = 'по квотам';
        if (type === 'vessel') suffix = 'по судам';
        if (type === 'tech') suffix = 'технический';
        if (type === 'fish') suffix = 'по минтаю сельди';
        if (type === 'crab') suffix = 'по выпуску краба';
        if (type === 'f19Querry') suffix = 'по вылову и выпуску продукции';

        // check empty report (check first then rename file and its path)
        const fileSize = fs.readFileSync(oldPath).byteLength;
        if (fileSize / 1024 < 85) {
            throw new Error('empty report');
        }

        let documentPath = `${path}Отчет ${suffix} от ${getDateNow()}.pdf`;

        // rename path report if pdf
        if (ext === 'pdf') {
            fs.renameSync(oldPath, documentPath);
            await timePromise(10000);
        } else {
            // if xlsx file dont change filename
            // prettier-ignore
            documentPath = 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\ДВ БД\\2025 Вылов выпуск.xlsx'
        }

        // get chat where I need to send report
        let chatId = 0;
        if (isDev()) {
            chatId = config.chatId[0];
        } else {
            chatId = config.groupChatId.channel;
        }
        if (type === 'tech') {
            chatId = config.groupChatId.debug;
        }

        await bot.botObj.sendDocument(chatId, documentPath);
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
