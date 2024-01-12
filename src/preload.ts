import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';

const electronApi = {
    api: {
        sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),
        downloadSSDFromMonth: () => ipcRenderer.send('downloadSSDFromMonth'),
        downloadSSDLast: () => ipcRenderer.send('downloadSSDLast'),

        downloadSSDAll: () => ipcRenderer.send('downloadSSDAll'),
        downloadCoords: () => ipcRenderer.send('downloadCoords'),
        onlyDownload: () => ipcRenderer.send('onlyDownload'),
        getPath: () => ipcRenderer.invoke('getPath'),
    },
    sendSettings: (settings: CheckBoxSettingsT) =>
        ipcRenderer.send('sendSettings', settings),
};

export type ElectronApi = typeof electronApi;

contextBridge.exposeInMainWorld('electronAPI', electronApi);
