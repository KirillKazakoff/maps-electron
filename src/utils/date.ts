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
        start: now.minus({ day: 1 }).startOf('month').toFormat(format),
        end: now.minus({ day: 1 }).toFormat(format),
    };
};
export const calcARMDateNow = () => {
    const now = DateTime.now();

    return {
        start: now.minus({ day: 1 }).toFormat(format),
        end: now.toFormat(format),
    };
};

export const getDateNow = () => {
    return DateTime.now().toFormat(format);
};

export const getDateF19Report = () => {
    return DateTime.now().minus({ day: 1 }).toFormat('yyyy.MM');
};

export const calcDateF10 = (params: { isTime: boolean; dateTime: DateTime }) => {
    const { isTime, dateTime } = params;
    const format = 'dd.MM.yyyy';
    const timeStr = dateTime.toFormat(format);

    return timeStr + ' ' + `${isTime ? '0:00:00' : ''}`;
};
