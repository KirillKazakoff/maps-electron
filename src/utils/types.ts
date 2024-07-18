// configTypes
import config from 'C:\\Users\\admin\\iCloudDrive\\Конспираторы\\ОВЭД\\БД Производство\\0_Аналитика ССД\\Конфигурация\\config.json';

export type ConfigT = typeof config;
export type SettingsLoginT = ConfigT['settings'][number];

// UtilsTypes
export type CheckBoxSettingsT = { name: string; isChecked: boolean };
export type DateSettingsT = { start: string; end: string };
export type RStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
