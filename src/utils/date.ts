import { DateTime } from 'luxon';

const format = 'dd-MM-yyyy';

export const calcARMDateMonth = (i: number) => {
    const now = DateTime.now();
    const start = now.minus({ month: i + 1 }).toFormat(format);
    const end = now.minus({ month: i }).toFormat(format);

    return { start, end };
};

export const calcARMDateDay = (settings: { start: number; end: number }) => {
    const { start, end } = settings;
    const now = DateTime.now();

    return {
        start: now.minus({ day: start }).toFormat(format),
        end: now.minus({ day: end }).toFormat(format),
    };
};

export const calcARMDateFromNow = () => {
    const now = DateTime.now();

    return {
        start: now.startOf('month').toFormat(format),
        end: now.toFormat(format),
    };
};

export const getDateF10Report = () => {
    const format = 'dd.MM.yyyy';
    const now = DateTime.now().minus({ day: 1 }).toFormat(format);

    return now + ' ' + '0:00:00';
};

export const getDateNow = () => {
    return DateTime.now().toFormat(format);
};

export const getDateF19Report = () => {
    return DateTime.now().minus({ day: 1 }).toFormat('yyyy.MM');
};
