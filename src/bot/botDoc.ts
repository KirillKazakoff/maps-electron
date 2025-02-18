import fs from 'fs';
import config from 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';
import { botLog } from './botLog';
import { getDateNow } from '../utils/date';
import { timePromise } from '../utils/time';
import { botSetup } from './botSetup';

type SettingsT = {
    path: string;
    type: 'vessel' | 'quotes' | 'fish' | 'tech' | 'crab' | 'f19Querry';
    sizeCheck?: number;
};

export class BotDoc {
    async doc({ path, type, sizeCheck }: SettingsT) {
        const name = path.split('//').pop().split('.').shift();
        if (!name) {
            botLog.bot('error on file path parsing on path: ' + path);
            return;
        }

        try {
            const fileSize = fs.readFileSync(path).byteLength;
            if (fileSize / 1024 < sizeCheck) {
                throw new Error('empty report');
            }

            // get chat where I need to send report
            let chat = config.chat.reports;
            if (type === 'tech') chat = config.chat.tech;

            await botSetup.api.sendDocument(chat.id, path);
        } catch (e) {
            if (e.message === 'empty report') {
                botLog.bot('empty report ' + name.toUpperCase());
                return;
            }

            botLog.bot('error on send document ' + name.toUpperCase() + '- ' + e.message);
        }
    }

    async pdf({ name: docName, type }: { name: string; type: SettingsT['type'] }) {
        const path =
            'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Отчеты для бота\\';
        const oldPath = path + docName + '.pdf';

        let suffix = '';
        if (type === 'quotes') suffix = 'по квотам';
        if (type === 'vessel') suffix = 'по судам';
        if (type === 'tech') suffix = 'технический';
        if (type === 'fish') suffix = 'по минтаю сельди';
        if (type === 'crab') suffix = 'по выпуску краба';

        const documentPath = `${path}Отчет ${suffix} от ${getDateNow()}.pdf`;

        // rename path report if pdf
        try {
            fs.renameSync(oldPath, documentPath);
        } catch (e) {
            botLog.bot(`Error on rename this doc path: ${documentPath}`);
            return;
        }

        await timePromise(5000);
        await this.doc({ sizeCheck: 85, path: documentPath, type });
    }

    async xlsx() {
        const path =
            'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\ДВ БД\\2025 Вылов выпуск.xlsx';
        await this.doc({ path, type: 'f19Querry', sizeCheck: 150 });
    }
}

export const botDoc = new BotDoc();
