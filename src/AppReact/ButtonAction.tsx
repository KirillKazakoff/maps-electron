import React from 'react';
import { ElectronApiT } from '../preload';

type ElKeysT = keyof ElectronApiT['api'];

type PropsT<T extends ElKeysT> = {
    id: T;
    children: React.ReactNode;
    params?: Parameters<ElectronApiT['api'][T]>;
};

export default function ButtonAction<T extends ElKeysT>({ id, children, params }: PropsT<T>) {
    const onClick = () => {
        window.electronAPI.api[id].apply(null, params);
    };

    return (
        <button type="button" onClick={onClick} className={`btn download-btn ${id}`}>
            {children}
        </button>
    );
}
