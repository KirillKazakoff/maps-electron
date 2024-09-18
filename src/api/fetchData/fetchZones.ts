import { SettingsLoginT } from '../../utils/types';
import { login } from '../../puppeteer/armBrowser/login';
import { setFunctionsInPageContext } from '../../puppeteer/setFunctionsInPageContext';

export async function sendZones(settings: SettingsLoginT) {
    const page = await login(settings);
    const functions = setFunctionsInPageContext(page);
    return await functions.fetchZones();
}
