import { makeAutoObservable } from 'mobx';
import { SettingsLoginT } from '../../utils/types';

const initDate = () => ({
    start: '2024-09-01',
    end: '2024-09-03',
});

export type FormDateT = ReturnType<typeof initDate>;

class SettingsStore {
    settings: SettingsLoginT[];
    date = initDate();
    schedule = '0 0 8 * * *';

    constructor() {
        makeAutoObservable(this);
    }

    setSettings(settings: SettingsLoginT[]) {
        this.settings = settings;
    }
    setDate(position: keyof FormDateT, value: string) {
        this.date[position] = value;
    }
    setSchedule(value: string) {
        this.schedule = value;
    }

    getSettingsByName(name: string) {
        if (!this.settings) return null;
        return this.settings.find((s) => s.name === name);
    }
}

const settingsStore = new SettingsStore();
export default settingsStore;
