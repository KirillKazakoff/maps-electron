import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';

const electronApi = {
    api: {
        sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),

        downloadSSDFromMonth: () => ipcRenderer.send('downloadSSDFromMonth'),
        downloadSSDMonthFull: () => ipcRenderer.send('downloadSSDMonthFull'),
        downloadSSDYear: () => ipcRenderer.send('downloadSSDYear'),
        downnloadSSDDate: () => ipcRenderer.send('downnloadSSDDate'),

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

export type ElectronApi = typeof electronApi;

contextBridge.exposeInMainWorld('electronAPI', electronApi);
