import { makeAutoObservable } from 'mobx';
import { SettingsLoginT } from '../../armRequest/downloadXML/downloadReports';

const initDate = () => ({
    start: '',
    end: '',
});

export type FormDateT = ReturnType<typeof initDate>;

class SettingsStore {
    settings: SettingsLoginT[];
    date = initDate();

    constructor() {
        makeAutoObservable(this);
    }

    setSettings(settings: SettingsLoginT[]) {
        this.settings = settings;
    }
    setDate(position: keyof FormDateT, value: string) {
        this.date[position] = value;
    }

    getSettingsByName(name: string) {
        if (!this.settings) return null;
        return this.settings.find((s) => s.name === name);
    }
}

const settingsStore = new SettingsStore();
export default settingsStore;
