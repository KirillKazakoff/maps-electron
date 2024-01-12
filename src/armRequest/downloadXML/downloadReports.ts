import puppeteer from 'puppeteer';
import { timePromise } from '../../utils/time';
import { browser } from '../browser';
import config from '../../config.json';
import { settingsLogin } from '../../index';

export type SettingsLoginT = (typeof config.settings)[number];
export type SettingsLoginCbT = (settings: SettingsLoginT) => Promise<any>;

export const downloadReports = async (callback: SettingsLoginCbT) => {
    for await (const settings of settingsLogin) {
        if (!settings.isChecked) continue;

        browser.instance = await puppeteer.launch({ devtools: true, headless: false });
        await callback(settings);
        await timePromise(8000);
        await browser.instance.close();
    }
};
