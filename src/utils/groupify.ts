/* eslint-disable no-param-reassign */
export function groupify<ReturnT>(
    total: any,
    initObj: any,
    code: string | number,
): ReturnT {
    let group = total[code];

    if (!group) {
        group = initObj;
        total[code] = group;
    }
    return group;
}
