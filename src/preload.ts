import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';
import { FormDateT } from './UI/stores/settingsStore';

const electronApi = {
    api: {
        // sendToNode
        downloadSSDDate: (date: FormDateT) => {
            ipcRenderer.send('downloadSSDDate', date);
        },

        sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),

        // sendToRenderer
        getPath: () => ipcRenderer.invoke('getPath'),
        getDefaultSettings: () => ipcRenderer.invoke('getDefaultSettings'),
    },
    sendSettings: (settings: CheckBoxSettingsT) => {
        ipcRenderer.send('sendSettings', settings);
    },
};

export type ElectronApiT = typeof electronApi;
export type ElectronApiKeys = keyof ElectronApiT['api'];

contextBridge.exposeInMainWorld('electronAPI', electronApi);
