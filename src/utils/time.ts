/* eslint-disable prefer-spread */

type UnknownFnT = (...args: any) => any;

type PromiseRes<T> = Promise<T extends UnknownFnT ? ReturnType<T> : string>;

export const timePromise = async <FnT extends UnknownFnT>(
    ms: number,
    callback?: FnT,
    ...args: FnT extends UnknownFnT ? Parameters<FnT> : void
): PromiseRes<FnT> => {
    if (callback) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const res = await callback.apply(null, args);
                resolve(res) as ReturnType<FnT>;
            }, ms);
        });
    }
    return new Promise((resolve) => {
        setTimeout(async () => {
            resolve('ok' as any);
        }, ms);
    });
};
