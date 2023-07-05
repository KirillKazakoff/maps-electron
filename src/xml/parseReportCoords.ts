import { Coordinates } from '../api/models';
import coordsReport from './filesDebug/coords.json';

export type CoordsReportJsonT = typeof coordsReport;

type CoordsReportT =
    (typeof coordsReport.Report.table1)[0]['Detail_Collection'][0]['Detail'];

const parseCoordinatesField = (value: string) => {
    const coordinates = value.split("'")[0].split('°').join('.');
    return coordinates;
};

export const parseCoordinates = (result: CoordsReportT) => {
    return result.reduce<Coordinates[]>((total, value) => {
        const vessel_id = value.NAME_VES[0].split(/[\(\)]/)[1];
        const course = value.COURSE ? +value.COURSE[0] : 0;
        const date = value.DATETIME[0];
        const velocity = +value.VELOCITY[0];

        const latitude = value.LATITUDE[0];
        const longitude = value.LONGITUDE[0];
        const latitudeParsed = parseCoordinatesField(latitude);
        const longitudeParsed = parseCoordinatesField(longitude);
        const coordinates = `${latitudeParsed} ${longitudeParsed}`;

        const obj: Coordinates = {
            coordinates,
            course,
            date,
            velocity,
            vessel_id,
        };

        total.push(obj);

        return total;
    }, []);
};
