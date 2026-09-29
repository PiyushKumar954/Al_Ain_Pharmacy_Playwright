import { ExcelUtility } from './excelReader.js';

const EXCEL_PATH = './TestData/AlAin_Footer.xlsx';

export function getFooterData(sheetName, filePath = EXCEL_PATH) {
    const xlutil = new ExcelUtility(filePath);

    const totalRows = xlutil.getRowCount(sheetName);
    const totalCols = xlutil.getCellCount(sheetName, 1);
    const data = [];

    for (let i = 1; i <= totalRows; i++) {
        const linkName = xlutil.getCellData(sheetName, i, 0);
        const expectedUrl = totalCols > 1 ? xlutil.getCellData(sheetName, i, 1) : '';
        if (linkName) {
            data.push({
                rowNum: i,
                linkName: linkName.trim(),
                expectedUrl: expectedUrl.trim()
            });
        }
    }
    return data;
}

export function getQuicklinkFooterData(filePath = EXCEL_PATH) {
    return getFooterData('Quick Links', filePath);
}

export function getHelpSupportFooterData(filePath = EXCEL_PATH) {
    return getFooterData('Help & Support', filePath);
}

export function getMyAccountsFooterData(filePath = EXCEL_PATH) {
    return getFooterData('My Accounts', filePath);
}

export function getSocialMediaFooterData(filePath = EXCEL_PATH) {
    return getFooterData('Social Media', filePath);
}

export function getAppStoresFooterData(filePath = EXCEL_PATH) {
    return getFooterData('App Stores', filePath);
}

export function getFooterLinkItem(sheetName, linkName, filePath = EXCEL_PATH) {
    const items = getFooterData(sheetName, filePath);
    const found = items.find(item => item.linkName.toLowerCase() === linkName.toLowerCase());
    return found || { linkName, expectedUrl: '' };
}

const LOGIN_EXCEL_PATH = './TestData/AlAin_Login.xlsx';

export function getLoginData(sheetName = 'LoginData', filePath = LOGIN_EXCEL_PATH) {
    const xlutil = new ExcelUtility(filePath);
    const totalRows = xlutil.getRowCount(sheetName);
    const data = [];

    for (let i = 1; i <= totalRows; i++) {
        const email = xlutil.getCellData(sheetName, i, 0);
        const password = xlutil.getCellData(sheetName, i, 1);
        const expected = xlutil.getCellData(sheetName, i, 2);
        if (email) {
            data.push({
                rowNum: i,
                email: email.trim(),
                password: password.trim(),
                expected: expected.trim()
            });
        }
    }
    return data;
}

export default {
    getFooterData,
    getQuicklinkFooterData,
    getHelpSupportFooterData,
    getMyAccountsFooterData,
    getSocialMediaFooterData,
    getAppStoresFooterData,
    getFooterLinkItem,
    getLoginData
};
