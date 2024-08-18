import { SettingsLoginT } from '../../utils/types';
import { login } from '../../xml/armBrowser/login';
import { setFunctionsInPageContext } from '../../xml/armBrowser/pageParse/setFunctionsInPageContext';

export async function sendZones(settings: SettingsLoginT) {
    const page = await login(settings);
    const functions = setFunctionsInPageContext(page);
    return await functions.fetchZones();
}
