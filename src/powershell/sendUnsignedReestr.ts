import ExcelJS, { Worksheet } from 'exceljs';
import { bot } from '../bot/bot';
const path = 'C:\\Users\\admin\\iCloudDrive\\ТАМОЖНЯ\\Реестр внутренний рынок.xlsx';

const getCell = (ws: Worksheet, cellName: string) => {
    const strArray = ws.getCell(cellName).result.toString().split('\n');
    return strArray.reduce<string>((total, row) => {
        const rowStr = `* ${row}\n`;
        total += rowStr;

        return total;
    }, '');
};

export const sendUnsignedReestr = async () => {
    const book = await new ExcelJS.Workbook().xlsx.readFile(path);

    const ws = book.getWorksheet('Неподписано');
    const cell = {
        current: getCell(ws, 'A1'),
        archive: getCell(ws, 'B1'),
    };

    const strCurrent = `${
        cell.current ? `<b>Неподписанные документы (2025):</b>\n\n${cell.current}` : ''
    } `;
    const strArchive = `${
        cell.archive ? `<b>Неподписанные документы (Архив):</b>\n\n${cell.archive}` : ''
    } `;

    bot.log.ovedDocs(`${strCurrent}\n\n${strArchive}`);
};
