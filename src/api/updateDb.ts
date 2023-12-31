import { login } from '../pageLogic/login';
import { setFunctionsInPageContext } from '../pageLogic/setFunctionsInPageContext';
import { SettingsLoginT } from '../xml/settingsLogin';

export async function updateDb(settings: SettingsLoginT) {
    const { browser } = await login(settings);
    const page = await browser.newPage();

    const functions = setFunctionsInPageContext(page);
    const zones = await functions.fetchZones();

    // updateZones(zones);
}
