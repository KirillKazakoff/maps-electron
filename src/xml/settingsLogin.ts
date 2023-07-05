import dotenv from 'dotenv';
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
        await callback(settings);
    }
};
