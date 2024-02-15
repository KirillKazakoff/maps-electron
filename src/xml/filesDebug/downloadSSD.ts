// import { calcARMDateDay, calcARMDateFromNow, calcARMDateMonth } from '../../utils/calcARMDate';
// import { login } from '../../armRequest/login';
// import { SettingsLoginT } from '../../armRequest/downloadXML/downloadReports';
// import { downloadXML } from '../../armRequest/downloadXML/downloadXML';

// export const downloadSSDSingle = async (settings: SettingsLoginT) => {
//     await login(settings);

//     const date = calcARMDateDay({ start: 7, end: -1 });

//     for await (const id of settings.vesselsId) {
//         console.log(id);
//         const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id.code}&StartDate=${date.start}&EndDate=${date.end}`;
//         await downloadXML(reportUrl);
//     }
// };

// export const downloadSSDFromMonthStart = async (settings: SettingsLoginT) => {
//     await login(settings);

//     const date = calcARMDateFromNow();

//     for await (const id of settings.vesselsId) {
//         console.log(id);
//         const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id.code}&StartDate=${date.start}&EndDate=${date.end}`;
//         await downloadXML(reportUrl);
//     }
// };

// export const downloadSSDMonthFull = async (settings: SettingsLoginT) => {
//     await login(settings);

//     const date = { start: '01-12-2023', end: '31-12-2023' };

//     for await (const id of settings.vesselsId) {
//         console.log(id);
//         const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id.code}&StartDate=${date.start}&EndDate=${date.end}`;
//         await downloadXML(reportUrl);
//     }
// };

// export const downloadSSDYear = async (settings: SettingsLoginT) => {
//     await login(settings);

//     const date = { start: '01-01-2023', end: '31-12-2023' };

//     for await (const id of settings.vesselsId) {
//         console.log(id);
//         const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id.code}&StartDate=${date.start}&EndDate=${date.end}`;
//         await downloadXML(reportUrl);
//     }
// };

// // export const downnloadSSDDate = async (settings: SettingsLoginT) => {
// //     await login(settings);

// //     for await (const id of settings.vesselsId) {
// //         console.log(id);
// //         const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id.code}&StartDate=${date.start}&EndDate=${date.end}`;
// //         await downloadXML(reportUrl);
// //     }
// // };

// // export const downloadSSDMultiple = async (settings: SettingsLoginT) => {
// //     await login(settings);
// //     // const vesselsId = await endpoints.get.vesselsByCompany(settings.companyId);

// //     for await (const id of settings.vesselsId) {
// //         const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
// //         for await (const i of numbers) {
// //             console.log(id, i);

// //             const date = calcARMDateMonth(i);
// //             const reportUrl = `https://mon.cfmc.ru/ReportViewer.aspx?Report=34&IsAdaptive=true&VesselShipId=${id.code}&StartDate=${date.start}&EndDate=${date.end}`;
// //             await downloadXML(reportUrl);
// //         }
// //     }
// // };
