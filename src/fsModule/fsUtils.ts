export const getUserName = () => {
    const res = __dirname.split('/')[2];
    return res;
};

export const getXMLDirPath = () => {
    const downloadDir = `/Users/${getUserName()}/Downloads`;
    const cloudDir = `/Users/${getUserName()}/Library/Mobile Documents/com~apple~CloudDocs/Конспираторы/ОВЭД/БД Производство/0_Аналитика ССД/ССД расшиф v2`;

    return {
        downloads: downloadDir,
        downloadsSSD: downloadDir + '/SSD/',
        ssd: cloudDir + '/SSD/',
    };
};
