// configTypes
import config from '../utils/configTypes.json';

export type ConfigT = typeof config;
export type VesselsT = ConfigT['vessels'];
export type SettingsT = ConfigT['settings']['main'];

// UtilsTypes
export type CheckBoxSettingsT = { name: string; isChecked: boolean };
export type DateSettingsT = { start: string; end: string };
export type RStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

// F19
export type F19T = {
    Report: Report;
};

export type Report = {
    Tablix1: Tablix1[];
};

export type Tablix1 = {
    Details_Collection: DetailsCollection[];
};

export type DetailsCollection = {
    Details: DetailsF19[];
};

export type DetailsF19 = {
    VES2: string[];
    OWN: string;
    date_val: string;
    CATCH_VOLUME: string;
    PROD_INFO?: string;
    TYPE_VES?: string;
    REGIME?: string;
    PERMIT?: string;
    OWNQUOTE?: string;
    REGION1?: string;
    FISH?: string[];
    PROD_BOARD_INFO?: string;
    SUBJECT_RF2?: string;
    SUBJECT_RF_QOUTE?: string;
};
