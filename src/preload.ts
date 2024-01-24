import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';

const electronApi = {
    api: {
        sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),

        downloadSSDFromMonth: () => ipcRenderer.send('downloadSSDFromMonth'),
        downloadSSDMonthFull: () => ipcRenderer.send('downloadSSDMonthFull'),
        downloadSSDYear: () => ipcRenderer.send('downloadSSDYear'),
        downnloadSSDDate: (date: { start: string; end: string }) =>
            ipcRenderer.send('downnloadSSDDate', date),

        downloadSSDLast: () => ipcRenderer.send('downloadSSDLast'),

        downloadSSDAll: () => ipcRenderer.send('downloadSSDAll'),
        downloadCoords: () => ipcRenderer.send('downloadCoords'),
        onlyDownload: () => ipcRenderer.send('onlyDownload'),

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
