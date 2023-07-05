import { DateTime } from 'luxon';

const format = 'dd-MM-yyyy';

export type ARMDateT = { start: string; end: string };

export const calcARMDate = (i: number) => {
    const now = DateTime.now();
    const start = now.minus({ month: i + 1 }).toFormat(format);
    const end = now.minus({ month: i }).toFormat(format);

    return { start, end };
};

export const calcARMDateNow = () => {
    const now = DateTime.now();
    const start = now.minus({ day: 1 }).toFormat(format);
    const end = now.toFormat(format);

    return { start, end };
};
