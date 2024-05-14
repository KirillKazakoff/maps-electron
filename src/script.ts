/* eslint-disable @typescript-eslint/no-var-requires */
import { SettingsLoginT } from './armRequest/downloadXML/downloadReports';
import { getDateObj } from './UI/logic/getDate';
import { downloadSSD } from './xml/downloadSSD';

export const script = (settings: SettingsLoginT) => {
    downloadSSD(getDateObj().fromYearStart());
};
