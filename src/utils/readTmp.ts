/* eslint-disable import/no-extraneous-dependencies */
import ExcelJS from 'exceljs';
import _ from 'lodash';

export const readTmp = async (path: string) => {
    const file = await (await fetch(path)).arrayBuffer();
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(file);

    return _.cloneDeep(book);
};
