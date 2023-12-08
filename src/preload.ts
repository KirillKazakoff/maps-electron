import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    downloadSSDLast: () => ipcRenderer.send('downloadSSDLast'),
    downloadSSDAll: () => ipcRenderer.send('downloadSSDAll'),
    downloadCoords: () => ipcRenderer.send('downloadCoords'),
    sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),

    sendSettings: (settings: string[]) => ipcRenderer.send('sendSettings', settings),
});
