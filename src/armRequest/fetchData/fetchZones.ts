import { SettingsLoginT } from '../../xml/downloadSSD';
import { login } from '../login';
import { setFunctionsInPageContext } from '../pageParse/setFunctionsInPageContext';

export async function sendZones(settings: SettingsLoginT) {
    const page = await login(settings);
    const functions = setFunctionsInPageContext(page);
    return await functions.fetchZones();
}
