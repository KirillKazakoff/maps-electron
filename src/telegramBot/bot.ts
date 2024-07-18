import { DateTime } from 'luxon';
import config from 'C:\\\\Users\\\\admin\\\\iCloudDrive\\\\Конспираторы\\\\ОВЭД\\\\БД Производство\\\\0_Аналитика ССД\\\\Конфигурация\\\\config.json';
import TelegramBot from 'node-telegram-bot-api';

const botObj = new TelegramBot(config.token, { polling: true });

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

bot.botObj.sendDocument(
    1082543248,
    'C:\\Users\\admin\\iCloudDrive\\ТАМОЖНЯ\\2024\\ВЛД 2024\\08_Лира_28.03.2024 (Бух. 29.03.2024)\\Экспорт\\Доп №215 (278-215).pdf'
);

// bot.botObj.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     if (msg.text.includes('ssd')) {
//         botObj.sendMessage(chatId);
//     }
// });
