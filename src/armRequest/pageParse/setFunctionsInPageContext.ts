/* eslint-disable @typescript-eslint/no-implied-eval */
import { Page } from 'puppeteer';

import { selectSpanReport, checkLiNoValue } from './selectSpan';
import { fetchVessels, fetchZones } from '../fetchData/arm';

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
        checkLiNoValue: evaluator(checkLiNoValue),
        selectSpan: evaluator(selectSpanReport),
        fetchVessels: evaluator(fetchVessels),
        fetchZones: evaluator(fetchZones),
    };

    return functions;
};
