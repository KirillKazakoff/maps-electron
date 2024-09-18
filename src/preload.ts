import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';
import { FormDateT } from './UI/stores/settingsStore';

const electronApi = {
    api: {
        // sendToNode (osm)
        // F16
        downloadSSDDate: (date: FormDateT) => {
            ipcRenderer.send('downloadSSDDate', date);
        },
        downloadF10Date: (date: FormDateT) => {
            ipcRenderer.send('downloadF10Date', date);
        },
        sendXMLSSD: () => ipcRenderer.send('sendXMLSSD'),
        sendPlanner: (schedule: string) => ipcRenderer.send('sendPlanner', schedule),

        sendManual: () => ipcRenderer.send('sendManual'),

        //F19
        sendF19: () => ipcRenderer.send('sendF19'),
        sendXMLF19: () => ipcRenderer.send('sendXMLF19'),
        //F10
        sendF10: () => ipcRenderer.send('sendF10'),

        // sendToNode (power AU)
        sendUpdateMd: () => ipcRenderer.send('sendUpdateMd'),
        sendUpdateModel: () => ipcRenderer.send('sendUpdateModel'),
        sendUpdateQuotes: () => ipcRenderer.send('sendUpdateQuotes'),
        sendUpdateRegister: () => ipcRenderer.send('sendUpdateRegister'),
        sendUpdateRDO: () => ipcRenderer.send('sendUpdateRDO'),
        sendReportDebug: () => ipcRenderer.send('sendReportDebug'),
        sendUpdateModelAll: () => ipcRenderer.send('sendUpdateModelAll'),
        sendPlannerRegisterMd: () => ipcRenderer.send('sendPlannerRegisterMd'),

        // sendToNode (cerber)
        sendStartCerber: () => ipcRenderer.send('sendStartCerber'),

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
