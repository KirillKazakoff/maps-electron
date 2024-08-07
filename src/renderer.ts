import settingsStore from './UI/stores/settingsStore';
import './UI/indexReact';
import { SettingsLoginT } from './utils/types';

const renderer = async () => {
    const settingsDefault =
        (await window.electronAPI.api.getDefaultSettings()) as SettingsLoginT[];

    settingsStore.setSettings(settingsDefault);
};

renderer();
