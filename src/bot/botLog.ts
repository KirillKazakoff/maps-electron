import { DateTime } from 'luxon';
import TelegramBot from 'node-telegram-bot-api';
import { botSetup as setup } from './botSetup';

type TextT = string | number;
type LogT = { id: number; text: TextT; options?: TelegramBot.SendMessageOptions };
const { chat: chat, api } = setup;

export class BotLog {
    log(log: LogT) {
        api.sendMessage(log.id, log.text.toString(), {
            ...log?.options,
            parse_mode: 'HTML',
        });
    }

    reports(text: TextT) {
        this.log({ text, ...chat.reports });
    }
    ovedDocs(text: TextT) {
        this.log({ text, ...chat.ovedDocuments });
    }
    tech(text: TextT) {
        this.log({ text, ...chat.tech });
    }
    bot(text: TextT) {
        this.log({ text, ...chat.bot });
    }

    botDated(text: TextT) {
        const dateStr = DateTime.now().toFormat('dd-MM-yyyy');
        this.bot(`${text} ${dateStr}`);
    }
}

export const botLog = new BotLog();
