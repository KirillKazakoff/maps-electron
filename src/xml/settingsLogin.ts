import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { browser } from '../browser';
import { timePromise } from '../utils/time';

dotenv.config();

export type SettingsLoginT = {
    login: string;
    password: string;
    companyId: string;
};
export type SettingsLoginCbT = (settings: SettingsLoginT) => Promise<any>;

export const settingsLogin: SettingsLoginT[] = [
    {
        login: process.env.LOGIN_TRK,
        password: process.env.PASSWORD_TRK,
        companyId: '3115',
    },
    {
        login: process.env.LOGIN_MSI,
        password: process.env.PASSWORD_MSI,
        companyId: '3301',
    },
    {
        login: process.env.LOGIN_MSTranzit,
        password: process.env.PASSWORD_MSTranzit,
        companyId: '1734',
    },
];

export const downloadReports = async (callback: SettingsLoginCbT) => {
    for await (const settings of Object.values(settingsLogin)) {
        browser.instance = await puppeteer.launch({ devtools: true, headless: false });
        await callback(settings);
        await timePromise(8000);
        await browser.instance.close();
    }
};
