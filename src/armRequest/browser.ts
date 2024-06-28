import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';

class BrowserC {
    instance: Browser | null;

    async launch() {
        if (!this.instance) return;
        this.instance = await puppeteer.launch({
            devtools: true,
            headless: false,
            protocolTimeout: 240000,
        });
        this.instance.on('disconnected', () => (this.instance = null));
    }

    async close() {
        if (!this.instance) return;
        await this.instance.close();
    }
}

export const browser = new BrowserC();
