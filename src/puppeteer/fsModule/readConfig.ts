import { configUrl } from './fsPathes';
import { ConfigT, SettingsLoginT } from '../../utils/types';
import fs from 'fs';

export let settingsLogin: SettingsLoginT[];

export const getConfig = (): ConfigT => JSON.parse(fs.readFileSync(configUrl).toString());

export const readConfig = () => {
    settingsLogin = getConfig().settings;
    console.log(settingsLogin[0].vesselsId);
};

export const rewriteConfig = () => {
    const config = getConfig();
    config.settings = settingsLogin;
    const json = JSON.stringify(config);
    fs.writeFileSync(configUrl, json);
};
