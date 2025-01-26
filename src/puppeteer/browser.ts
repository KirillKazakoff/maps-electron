import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';
import { timePromise } from '../utils/time';
import { bot } from '../telegramBot/bot';

class BrowserC {
    instance: Browser | null;
    errorTimes = 0;

    async launch() {
        this.instance = await puppeteer.launch({
            devtools: true,
            headless: false,
        });

        setTimeout(() => {
            try {
                this.instance.close();
            } catch (e) {
                return;
            }
        }, 1000000);
    }

    async close() {
        if (!this.instance) return;
        await this.instance.close();
    }

    async clear(timers?: NodeJS.Timer[], isError?: boolean) {
        bot.sendLog(this.errorTimes);

        if (isError) {
            this.errorTimes += 1;
        } else {
            this.errorTimes = 0;
        }

        let cooldown = 2000;

        if (this.errorTimes >= 30) {
            cooldown = 3600 * 1000;
            this.errorTimes = 0;
        }
        await timePromise(8000);

        if (timers) {
            timers.forEach((timer) => clearTimeout(timer as unknown as number));
        }
        await this.instance.close();

        await timePromise(cooldown);
    }
}

export const browser = new BrowserC();

export type BrowserT = typeof browser;
