// import { bot } from '../../bot/bot';

const username = __dirname.split(/[/\\]/)[2];
const isAdmin = username === 'admin';
// prettier-ignore
export const firstPart = isAdmin ? `C:\\Users\\admin\\iCloudDrive\\` : '\\\\Mac\\iCloud\\';
const serverPath = isAdmin ? 'C:\\Users\\admin' : 'C:\\users\\kirillkazakov';

const mainDir = `${firstPart}Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД`;
const downloadDir = isAdmin ? `${serverPath}\\Downloads` : `\\\\Mac\\Home\\Downloads`;
const pshDir = `${serverPath}\\Desktop\\Repo\\maps-electron\\src\\powershell\\`;
const cloudDir = mainDir + '\\ССД расшиф v2';

export const configUrl = mainDir + '\\Конфигурация\\config.json';

// setTimeout(() => bot.log.bot(username), 5000)

export const getDirPathes = () => {
    return {
        powershell: pshDir,
        downloads: downloadDir,
        downloadsSSD: downloadDir + '\\SSD\\',
        ssd: cloudDir + '\\SSD\\',
        archive: cloudDir + '\\Архив\\2024\\',
        getArchiveDate: (month: string) => cloudDir + `\\Архив\\2024\\${month}`,
        quotes: mainDir + '\\КВОТЫ ССД\\Квоты РФ',
        quotesFormDate: mainDir + '\\КВОТЫ ССД\\Квоты РФ Выгрузка',
        f19: mainDir + '\\ДВ БД\\Выгрузки\\Вылов (форма Ф19)\\',
    };
};
