import { DateTime } from 'luxon';
import { FormDateT } from '../stores/settingsStore';

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
            const end = 0;

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
                end: now.minus({ day: 1 }).toFormat(toFormat),
            };
        },
        fromDate: ({ start, end }: FormDateT) => {
            let format = fromFormat;
            const dateCheck = DateTime.fromFormat(start, format);

            if (!dateCheck.isValid) format = toFormat;

            const dateTimeStart = DateTime.fromFormat(start, format);
            const dateTimeEnd = end ? DateTime.fromFormat(end, format) : now;

            const date = {
                timeObj: {
                    end: dateTimeEnd,
                    start: dateTimeStart,
                },
                start: dateTimeStart.toFormat(toFormat),
                end: dateTimeEnd.toFormat(toFormat),
            };

            return date;
        },
    };
};
