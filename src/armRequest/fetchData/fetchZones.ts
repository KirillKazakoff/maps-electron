import { ConfigT } from '../../utils/types';
import { login } from '../login';
import { setFunctionsInPageContext } from '../pageParse/setFunctionsInPageContext';

export async function sendZones(settings: ConfigT) {
    const page = await login(settings);
    const functions = setFunctionsInPageContext(page);
    return await functions.fetchZones();
}
