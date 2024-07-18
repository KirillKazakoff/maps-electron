const mainDir =
    'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД';
const downloadDir = 'C:\\Users\\admin\\Downloads';

export const configUrl = mainDir + '\\Конфигурация\\config.json';
const cloudDir = mainDir + '\\ССД расшиф v2';

export const getUserName = () => {
    const res = __dirname.split(/[/\\]/)[2];

    return res;
};

export const getXMLDirPath = () => {
    const userName = getUserName();

    if (!userName) return;

    return {
        downloads: downloadDir,
        downloadsSSD: downloadDir + '\\SSD\\',
        debug: downloadDir + '\\NEW AGE\\',
        ssd: cloudDir + '\\SSD\\',
    };
};
