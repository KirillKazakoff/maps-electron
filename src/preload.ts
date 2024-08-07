import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';
import { FormDateT } from './UI/stores/settingsStore';

const electronApi = {
    api: {
        // sendToNode (osm)
        downloadSSDDate: (date: FormDateT) => {
            ipcRenderer.send('downloadSSDDate', date);
        },
        sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),
        sendPlanner: (schedule: string) => ipcRenderer.send('sendPlanner', schedule),
        sendManual: () => ipcRenderer.send('sendManual'),
        //F19
        sendF19: () => ipcRenderer.send('sendF19'),
        sendXMLF19: () => ipcRenderer.send('sendXMLF19'),

        // sendToNode (register md)
        sendUpdateRegister: () => ipcRenderer.send('sendUpdateRegister'),
        sendUpdateMd: () => ipcRenderer.send('sendUpdateMd'),
        sendPlannerRegisterMd: () => ipcRenderer.send('sendPlannerRegisterMd'),

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
