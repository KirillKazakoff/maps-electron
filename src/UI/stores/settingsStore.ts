import { makeAutoObservable } from 'mobx';
import { ConfigT } from '../../utils/types';

const initDate = () => ({
    start: '',
    end: '',
});

export type FormDateT = ReturnType<typeof initDate>;

class SettingsStore {
    settings: ConfigT[];
    date = initDate();
    schedule = '0 0 13 * * *';

    constructor() {
        makeAutoObservable(this);
    }

    setSettings(settings: ConfigT[]) {
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
