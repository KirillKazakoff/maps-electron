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
        //F10
        sendF10: () => ipcRenderer.send('sendF10'),

        // sendToNode (register md)
        sendUpdateMd: () => ipcRenderer.send('sendUpdateMd'),
        sendUpdateModel: () => ipcRenderer.send('sendUpdateModel'),
        sendUpdateRegister: () => ipcRenderer.send('sendUpdateRegister'),
        sendUpdateRDO: () => ipcRenderer.send('sendUpdateRDO'),

        sendPlannerRegisterMd: () => ipcRenderer.send('sendPlannerRegisterMd'),

        // sendToRenderer
        getPath: () => ipcRenderer.invoke('getPath'),
        getDefaultSettings: () => ipcRenderer.invoke('getDefaultSettings'),
    },
    sendSettings: (settings: CheckBoxSettingsT) => {
        ipcRenderer.send('sendSettings', settings);
    },
    getDevStatus: () => ipcRenderer.invoke('getDevStatus'),
};

export type ElectronApiT = typeof electronApi;
export type ElectronApiKeys = keyof ElectronApiT['api'];

contextBridge.exposeInMainWorld('electronAPI', electronApi);
