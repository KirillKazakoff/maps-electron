import { groupify } from '../../../utils/groupify';
import { SSDReportT } from './parseInfo';

const initTrap = (code: string) => ({ amount: 0, amountStr: '0', desc: code });
type TrapT = ReturnType<typeof initTrap>;

export const parseTrap = (json: SSDReportT) => {
    const t = json.Subreport6[0].Report[0].Tablix8[0];
    if (!t || typeof t === 'string') return null;

    const table = t.OPER_NUM_Collection[0].OPER_NUM;
    const trapData = table.reduce<{ [key: string]: TrapT }>((total, row) => {
        const code = row.Textbox18[0].toLowerCase();
        const isTral = code.includes('трал');
        const isTrap = code.includes('ловушка');
        const instrumentStr = isTrap ? 'порядков' : isTral ? 'операций' : 'операций';

        const trap = groupify(total, initTrap(code), code);
        trap.amount += 1;
        trap.amountStr = `Кол-во ${instrumentStr}: ${trap.amount}`;

        return total;
    }, {});

    const trapArray = Object.values(trapData).map((trap) => trap);
    if (trapArray.length === 0) return null;

    return trapArray;
};
