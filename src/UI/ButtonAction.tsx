import React from 'react';
import { ElectronApiT } from '../preload';
import _ from 'lodash';

type ElKeysT = keyof ElectronApiT['api'];

type PropsT<T extends ElKeysT> = {
    id: T;
    children: React.ReactNode;
    params?: Parameters<ElectronApiT['api'][T]>;
    cls?: string;
};

export default function ButtonAction<T extends ElKeysT>({
    id,
    children,
    params,
    cls,
}: PropsT<T>) {
    const onClick = () => {
        const clone = _.cloneDeep(params);
        window.electronAPI.api[id].apply(null, clone);
    };

    return (
        <button type="button" onClick={onClick} className={`btn download-btn ${id} ${cls}`}>
            {children}
        </button>
    );
}
