/* eslint-disable @typescript-eslint/no-implied-eval */
import { Page } from 'puppeteer';

import { selectSpan } from './selectSpan';
import { fetchVessels, fetchZones } from '../api/arm';

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
                ...args,
            );
        };
        return closure;
    }

    const functions = {
        selectSpan: evaluator<typeof selectSpan>(selectSpan),
        fetchVessels: evaluator<typeof fetchVessels>(fetchVessels),
        fetchZones: evaluator<typeof fetchZones>(fetchZones),
    };

    return functions;
};
