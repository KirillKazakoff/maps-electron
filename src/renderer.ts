import settingsStore from './UI/stores/settingsStore';
import { SettingsLoginT } from './armRequest/downloadXML/downloadReports';
import './UI/indexReact';

const renderer = async () => {
    const settingsDefault =
        (await window.electronAPI.api.getDefaultSettings()) as SettingsLoginT[];

    settingsStore.setSettings(settingsDefault);
};

renderer();
