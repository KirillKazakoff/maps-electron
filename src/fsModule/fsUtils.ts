export const getUserName = () => {
    const res = __dirname.split(/[/\\]/)[2];

    return res;
};

export const getXMLDirPath = () => {
    const userName = getUserName();

    if (!userName) return;

    const downloadDir = 'C:\\Users\\admin\\Downloads';

    const cloudDir =
        'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\ССД расшиф v2';

    // const cloudDir = 'C:\\Users\\admin\\Desktop';

    return {
        downloads: downloadDir,
        downloadsSSD: downloadDir + '\\SSD\\',
        debug: downloadDir + '\\NEW AGE\\',
        ssd: cloudDir + '\\SSD\\',
    };
};
