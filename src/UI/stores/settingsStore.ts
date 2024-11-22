import { makeAutoObservable } from 'mobx';

const initDate = () => ({
    start: '2024-09-01',
    end: '2024-09-03',
});

export type FormDateT = ReturnType<typeof initDate>;

class SettingsStore {
    date = initDate();
    schedule = '0 0 8 * * *';

    constructor() {
        makeAutoObservable(this);
    }

    setDate(position: keyof FormDateT, value: string) {
        this.date[position] = value;
    }
    setSchedule(value: string) {
        this.schedule = value;
    }
}

const settingsStore = new SettingsStore();
export default settingsStore;
