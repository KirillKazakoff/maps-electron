/* eslint-disable @typescript-eslint/no-var-requires */
import { getDateObj } from './UI/logic/getDate';
import { downloadSSD } from './xml/downloadSSD';

export const script = () => {
    downloadSSD(getDateObj().fromYearStart());
};
