import { contextBridge, ipcRenderer } from 'electron';
import { CheckBoxSettingsT } from './utils/types';
import { FormDateT } from './UI/stores/settingsStore';

const electronApi = {
    api: {
        // sendToNode (osm)
        //F19
        sendF19: () => ipcRenderer.send('sendF19'),
        sendXMLF19: () => ipcRenderer.send('sendXMLF19'),
        sendF16Company: () => ipcRenderer.send('sendF16Company'),

        // F16
        sendF16: (date: FormDateT) => ipcRenderer.send('sendF16', date),
        sendXMLF16: () => ipcRenderer.send('sendXMLF16'),

        //F10
        sendF10: () => ipcRenderer.send('sendF10'),
        sendF10Date: (date: FormDateT) => ipcRenderer.send('sendF10Date', date),

        // osmLoad
        sendPlanner: (schedule: string) => ipcRenderer.send('sendPlanner', schedule),
        sendManual: () => ipcRenderer.send('sendManual'),

        // sendToNode (power AU)
        sendUpdateMd: () => ipcRenderer.send('sendUpdateMd'),
        sendUpdateModel: () => ipcRenderer.send('sendUpdateModel'),
        sendUpdateQuotes: () => ipcRenderer.send('sendUpdateQuotes'),
        sendUpdateRegister: () => ipcRenderer.send('sendUpdateRegister'),
        sendUpdateRDO: () => ipcRenderer.send('sendUpdateRDO'),
        sendReportDebug: () => ipcRenderer.send('sendReportDebug'),
        sendUpdateModelAll: () => ipcRenderer.send('sendUpdateModelAll'),
        sendPlannerRegisterMd: () => ipcRenderer.send('sendPlannerRegisterMd'),
        sendUpdateF19QuerryReport: () => ipcRenderer.send('sendUpdateF19QuerryReport'),
        sendUnsignedReestr: () => ipcRenderer.send('sendUnsignedReestr'),

        // sendToNode (cerber)
        sendStartCerber: () => ipcRenderer.send('sendStartCerber'),

        // sendToRenderer
        getPath: () => ipcRenderer.invoke('getPath'),
        getDefaultSettings: () => ipcRenderer.invoke('getDefaultSettings'),
    },

    // utils
    sendSettings: (settings: CheckBoxSettingsT) => ipcRenderer.send('sendSettings', settings),
    getDevStatus: () => ipcRenderer.invoke('getDevStatus'),
};

export type ElectronApiT = typeof electronApi;
export type ElectronApiKeys = keyof ElectronApiT['api'];

contextBridge.exposeInMainWorld('electronAPI', electronApi);
