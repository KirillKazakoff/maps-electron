import settingsStore from './AppReact/stores/settingsStore';
import { SettingsLoginT } from './armRequest/downloadXML/downloadReports';
import './indexReact';

const renderer = async () => {
    const settingsDefault =
        (await window.electronAPI.api.getDefaultSettings()) as SettingsLoginT[];

    settingsStore.setSettings(settingsDefault);
};

renderer();
