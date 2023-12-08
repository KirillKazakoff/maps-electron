import { login } from '../login';
import { setFunctionsInPageContext } from '../pageParse/setFunctionsInPageContext';

import { SettingsLoginT } from '../settingsLogin';

export async function sendZones(settings: SettingsLoginT) {
    const page = await login(settings);
    const functions = setFunctionsInPageContext(page);
    return await functions.fetchZones();
}
