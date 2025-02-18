import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';
import { timePromise } from '../utils/time';
import { bot } from '../bot/bot';

class BrowserC {
    instance: Browser | null;
    errorTimes = 0;

    async launch() {
        this.instance = await puppeteer.launch({
            devtools: true,
            headless: false,
        });

        // close browser window in any case in 90 minutes
        setTimeout(() => {
            try {
                this.instance.close();
            } catch (e) {
                return;
            }
        }, 1000 * 60 * 90);
    }

    async close() {
        if (!this.instance) return;
        await this.instance.close();
    }

    async clear(timers: NodeJS.Timer[], isError: boolean) {
        // refresh if no error
        if (isError) {
            bot.log.bot(`Error count: ${this.errorTimes}`);
            this.errorTimes += 1;
        } else {
            this.errorTimes = 0;
        }

        // make cooldown if many errors
        let cooldown = 2000;

        if (this.errorTimes >= 20) {
            cooldown = 3600 * 1000;
            this.errorTimes = 0;
        }
        await timePromise(8000);

        if (timers) {
            timers.forEach((timer) => clearTimeout(timer as unknown as number));
        }
        await this.close();

        await timePromise(cooldown);
    }
}

export const browser = new BrowserC();

export type BrowserT = typeof browser;
