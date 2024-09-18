/* eslint-disable @typescript-eslint/no-implied-eval */
import { Page } from 'puppeteer';

import { checkLiNoValue, checkPageStatusLoading } from './armBrowser/functionsOsmDOM';
import { fetchVessels, fetchZones } from '../api/fetchData/arm';
import { checkPageStatusLoadingCerber, getCerberStatus } from './cerber/functionsCerberDOM';

type UnknownFnT = (...args: any) => any;
type EvaluatedT<FnT extends UnknownFnT> = (
    ...params: Parameters<FnT>
) => Promise<ReturnType<FnT>>;

export const setFunctionsInPageContext = (page: Page) => {
    // evaluatorWrapper
    function evaluator<FnT extends UnknownFnT>(callback: FnT) {
        const closure: EvaluatedT<FnT> = async function (...args) {
            return page.evaluate(
                async (str: string, ...argsPage) => {
                    const func = new Function(`return ${str}.apply(null, arguments)`);
                    return func(...argsPage);
                },
                callback.toString(),
                ...args
            );
        };
        return closure;
    }

    const functions = {
        // osm
        checkLiNoValue: evaluator(checkLiNoValue),
        checkPageStatusLoading: evaluator(checkPageStatusLoading),
        fetchVessels: evaluator(fetchVessels),
        fetchZones: evaluator(fetchZones),
        // cerber
        checkPageStatusLoadingCerber: evaluator(checkPageStatusLoadingCerber),
        getCerberStatus: evaluator(getCerberStatus),
    };

    return functions;
};

export type FunctionsT = ReturnType<typeof setFunctionsInPageContext>;
