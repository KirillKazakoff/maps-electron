import puppeteer from 'puppeteer';
import { browser } from './browser';
import { timePromise } from '../utils/time';
import config from '../../config.json';

export const settingsLogin = config;
export type SettingsLoginT = (typeof config)[number];
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
