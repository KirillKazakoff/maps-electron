import { configUrl } from './fsPathes';
import { ConfigT, SettingsT, VesselsT } from '../../utils/types';
import fs from 'fs';

export let vessels: VesselsT;
export let settings: SettingsT;

export const getConfig = (): ConfigT => JSON.parse(fs.readFileSync(configUrl).toString());

export const readConfig = () => {
    const config = getConfig();

    vessels = config.vessels;
    settings = config.settings.main;
};

export const rewriteConfig = () => {
    const config = getConfig();

    config.vessels = vessels;
    const json = JSON.stringify(config);
    fs.writeFileSync(configUrl, json);
};
