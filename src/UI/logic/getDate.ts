import { DateTime } from 'luxon';
import settingsStore from '../stores/settingsStore';

export const getDateObj = () => {
    const toFormat = 'dd-MM-yyyy';
    const fromFormat = 'yyyy-MM-dd';
    const now = DateTime.now();

    return {
        month: (i: number) => {
            const start = now.minus({ month: i + 1 }).toFormat(toFormat);
            const end = now.minus({ month: i }).toFormat(toFormat);

            return { start, end };
        },
        day: () => {
            const start = 7;
            const end = -1;

            return {
                start: now.minus({ day: start }).toFormat(toFormat),
                end: now.minus({ day: end }).toFormat(toFormat),
            };
        },
        fromLastMonth: () => {
            return {
                start: now.startOf('month').toFormat(toFormat),
                end: now.toFormat(toFormat),
            };
        },
        fromYearStart: () => {
            return {
                start: now.startOf('year').toFormat(toFormat),
                end: now.toFormat(toFormat),
            };
        },
        fromDatePicker: () => {
            const { start, end } = settingsStore.date;
            const dateTimeStart = DateTime.fromFormat(start, fromFormat);
            const dateTimeEnd = end ? DateTime.fromFormat(end, fromFormat) : now;

            const date = {
                end: dateTimeEnd.toFormat(toFormat),
                start: dateTimeStart.toFormat(toFormat),
            };

            return date;
        },
    };
};
