type ZoneT = {
    Name: string;
    Id: string;
};

export const fetchVessels = async () => {
    return fetch(
        'https://mon.cfmc.ru/api/VesselShips/GetGrid?skip=0&%24inlinecount=allpages&orderby=Name&%24filter=substringof(%27%27%2CName)+or+substringof(%27%27%2CBoardNumber)&listId=1352447&basics=',
        {
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'sec-ch-ua':
                    '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
            },
            referrer: 'https://mon.cfmc.ru/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        },
    ).then((res) => res.json().then((r) => console.log(r)));
};

export async function fetchZones() {
    const res = await fetch(
        'https://mon.cfmc.ru/api/Regions?&orderby=Name+asc&%24skip=0&%24inlinecount=allpages&%24expand=Children&%24filter=substringof(%27%27%2CName)&_=1684134293395',
        {
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'prefer': 'return-content',
                'sec-ch-ua':
                    '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
            },
            referrer: 'https://mon.cfmc.ru/Home/Permitions',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        },
    );

    const zones: ZoneT[] = (await res.json()).value;
    const zonesArr = zones.map((zone) => [zone.Id, zone.Name]);

    return zonesArr;
}

export const fetchOwners = async () => {
    return fetch(
        'https://mon.cfmc.ru/api/Owners/GetGrid?skip=0&%24inlinecount=allpages&orderby=Name&%24filter=substringof(%27%27%2CName)&listId=116124&basics=',
        {
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'sec-ch-ua':
                    '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
            },
            referrer: 'https://mon.cfmc.ru/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        },
    ).then((res) => res.json().then((r) => console.log(r)));
};

// export async function fetchVesselList() {
//     const res1 = await fetch('https://mon.cfmc.ru/api/VesselsLists/CreateTemporary', {
//         headers: {
//             'accept': '*/*',
//             'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
//             'content-type': 'application/json',
//             'prefer': 'return-content',
//             'sec-ch-ua':
//                 '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"macOS"',
//             'sec-fetch-dest': 'empty',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-site': 'same-origin',
//             'x-requested-with': 'XMLHttpRequest',
//         },
//         referrer: 'https://mon.cfmc.ru/',
//         referrerPolicy: 'strict-origin-when-cross-origin',
//         body: '{"dto":{"Ids":[14002,14023,28479,14041],"ListId":"1569072","IsSelectAll":false,"BasicIds":[],"TextFilter":""}}',
//         method: 'POST',
//         mode: 'cors',
//         credentials: 'include',
//     });

//     const res2 = await res1.json();
//     console.log(res2);
// }

// const fetchVesselList = async () => {
//     const res = await fetch(
//         'https://mon.cfmc.ru/api/Reports?$expand=ReportReportsParameters/ReportsParameter&$filter=Id%20eq%2018&_=1688088027560',
//         {
//             headers: {
//                 'accept': 'application/json, text/javascript, */*; q=0.01',
//                 'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
//                 'prefer': 'return-content',
//                 'sec-ch-ua':
//                     '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
//                 'sec-ch-ua-mobile': '?0',
//                 'sec-ch-ua-platform': '"macOS"',
//                 'sec-fetch-dest': 'empty',
//                 'sec-fetch-mode': 'cors',
//                 'sec-fetch-site': 'same-origin',
//                 'x-requested-with': 'XMLHttpRequest',
//             },
//             referrer: 'https://mon.cfmc.ru/',
//             referrerPolicy: 'strict-origin-when-cross-origin',
//             body: null,
//             method: 'GET',
//             mode: 'cors',
//             credentials: 'include',
//         },
//     );
//     const res2 = await res.json();
//     console.log(res2);
// };
