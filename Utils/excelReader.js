import xlsx from 'xlsx';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export class ExcelUtility {

    constructor(filePath) {
        this.path = path.resolve(filePath);
    }

    getRowCount(sheetName) {
        try {
            const workbook = xlsx.readFile(this.path);
            const sheet = workbook.Sheets[sheetName];
            if (!sheet || !sheet['!ref']) return 0;
            const range = xlsx.utils.decode_range(sheet['!ref']);
            return range.e.r;
        } catch (e) {
            return 0;
        }
    }

    getCellCount(sheetName, rownum) {
        try {
            const workbook = xlsx.readFile(this.path);
            const sheet = workbook.Sheets[sheetName];
            if (!sheet || !sheet['!ref']) return 0;
            const range = xlsx.utils.decode_range(sheet['!ref']);
            return range.e.c + 1;
        } catch (e) {
            return 0;
        }
    }

    getCellData(sheetName, rownum, colnum) {
        try {
            const workbook = xlsx.readFile(this.path);
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return '';
            const cellAddress = xlsx.utils.encode_cell({ r: rownum, c: colnum });
            const cell = sheet[cellAddress];
            if (!cell || cell.v === undefined || cell.v === null) return '';
            return cell.w !== undefined ? String(cell.w) : String(cell.v);
        } catch (e) {
            return '';
        }
    }

    async setCellData(sheetName, rownum, colnum, data) {
        const workbook = new ExcelJS.Workbook();
        if (fs.existsSync(this.path)) {
            await workbook.xlsx.readFile(this.path);
        }
        let sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            sheet = workbook.addWorksheet(sheetName);
        }
        const row = sheet.getRow(rownum + 1);
        const cell = row.getCell(colnum + 1);
        cell.value = data;
        await workbook.xlsx.writeFile(this.path);
    }

    async fillGreenColor(sheetName, rownum, colnum) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(this.path);
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) return;
        const row = sheet.getRow(rownum + 1);
        const cell = row.getCell(colnum + 1);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF28A745' } // Solid Green (IndexedColors.GREEN)
        };
        await workbook.xlsx.writeFile(this.path);
    }

    async fillRedColour(sheetName, rownum, colnum) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(this.path);
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) return;
        const row = sheet.getRow(rownum + 1);
        const cell = row.getCell(colnum + 1);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDC3545' } // Solid Red (IndexedColors.RED)
        };
        await workbook.xlsx.writeFile(this.path);
    }

    async fillRedColor(sheetName, rownum, colnum) {
        await this.fillRedColour(sheetName, rownum, colnum);
    }

    getSheetData(sheetName) {
        return getExcelSheetData(this.path, sheetName);
    }
}


export function getExcelSheetData(relativeFilePath, sheetName) {
    const absolutePath = path.resolve(relativeFilePath);
    const workbook = xlsx.readFile(absolutePath);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found in ${relativeFilePath}`);
    }
    return xlsx.utils.sheet_to_json(sheet);
}

export function getAllExcelData(relativeFilePath) {
    const absolutePath = path.resolve(relativeFilePath);
    const workbook = xlsx.readFile(absolutePath);
    const allSheetsData = {};
    for (const name of workbook.SheetNames) {
        allSheetsData[name] = xlsx.utils.sheet_to_json(workbook.Sheets[name]);
    }
    return allSheetsData;
}

export default ExcelUtility;