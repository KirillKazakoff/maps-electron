import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';
import { timePromise } from '../../utils/time';

class BrowserC {
    instance: Browser | null;

    async launch() {
        if (!this.instance) return;
        this.instance = await puppeteer.launch({
            devtools: true,
            headless: false,
            protocolTimeout: 240000,
            timeout: 100000,
        });
        this.instance.on('disconnected', () => (this.instance = null));
    }

    async close() {
        if (!this.instance) return;
        await this.instance.close();
    }

    async clear(timers: NodeJS.Timer[]) {
        await timePromise(8000);

        timers.forEach((timer) => clearTimeout(timer));
        await this.instance.close();

        await timePromise(2000);
    }
}

export const browser = new BrowserC();

export type BrowserT = typeof browser;
