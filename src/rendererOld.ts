import { SettingsLoginT } from './armRequest/downloadXML/downloadReports';

const renderer = async () => {
    [
        'downloadSSDFromMonth',
        'downloadSSDMonthFull',
        'downloadSSDYear',
        'downnloadSSDDate',
    ].forEach((action: keyof typeof window.electronAPI.api) => {
        const btn = document.querySelector('.' + action);
        btn.addEventListener('click', () => window.electronAPI.api[action]());
    });

    const userName = (await window.electronAPI.api.getPath()) as string;
    const settingsDefault =
        (await window.electronAPI.api.getDefaultSettings()) as SettingsLoginT[];
    console.log(userName);

    const getSettings = (checkBox: HTMLInputElement) => ({
        name: checkBox.id,
        isChecked: checkBox.checked,
    });

    ['#trk', '#msi', '#tranzit']
        .map((id) => document.querySelector(id) as HTMLInputElement)
        .forEach((checkBox) => {
            const settings = {
                name: checkBox.id,
                isChecked: checkBox.checked,
            };
            window.electronAPI.sendSettings(settings);

            checkBox.addEventListener('click', () => {
                window.electronAPI.sendSettings(getSettings(checkBox));
            });

            const defaultSettingsInstance = settingsDefault.find(
                (s) => s.name === settings.name
            );

            if (!defaultSettingsInstance.isChecked) {
                checkBox.checked = null;
            }
            if (checkBox.id === 'tranzit') {
                console.log(checkBox);
                console.log(defaultSettingsInstance);
            }
        });
};

renderer();
