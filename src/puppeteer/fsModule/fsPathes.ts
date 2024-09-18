// prettier-ignore
const mainDir ='C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД';
const downloadDir = 'C:\\Users\\admin\\Downloads';
const pshDir = 'C:\\Users\\admin\\Desktop\\Repo\\maps-electron\\src\\powershell\\';

export const configUrl = mainDir + '\\Конфигурация\\config.json';
const cloudDir = mainDir + '\\ССД расшиф v2';

export const getUserName = () => {
    const res = __dirname.split(/[/\\]/)[2];

    return res;
};

export const getDirPathes = () => {
    return {
        powershell: pshDir,
        downloads: downloadDir,
        downloadsSSD: downloadDir + '\\SSD\\',
        ssd: cloudDir + '\\SSD\\',
        quotes: mainDir + '\\КВОТЫ ССД\\Квоты РФ',
        quotesFormDate: mainDir + '\\КВОТЫ ССД\\Квоты РФ Выгрузка',
        f19: mainDir + '\\ДВ БД\\Выгрузки\\Вылов (форма Ф19)\\',
    };
};
