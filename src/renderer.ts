import { SettingsLoginT } from './armRequest/downloadXML/downloadReports';
import './index.css';
import { ElectronApi } from './preload';

declare global {
    interface Window {
        electronAPI: ElectronApi;
    }
}

const renderer = async () => {
    [
        // 'sendXMLSSD',
        // 'downloadSSDLast',
        'downloadSSDFromMonth',
        'downloadSSDMonthFull',
        'downloadSSDYear',
        'downnloadSSDDate',
        // 'downloadCoords',
        // 'downloadSSDAll',
        // 'onlyDownload',
    ].forEach((action: keyof typeof window.electronAPI.api) => {
        const btn = document.querySelector('.' + action);
        const action2 = action;
        btn.addEventListener('click', () => window.electronAPI.api[action2]());
    });

    // const userName = await window.electronAPI.api.getPath() as string;
    const settingsDefault =
        (await window.electronAPI.api.getDefaultSettings()) as SettingsLoginT[];

    const getSettings = (checkBox: HTMLInputElement) => {
        console.log('HERER');
        return {
            name: checkBox.id,
            isChecked: checkBox.checked,
        };
    };

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
            // console.log(checkBox.id);
            if (checkBox.id === 'tranzit') {
                console.log(checkBox);
                console.log(defaultSettingsInstance);
            }
        });
};

renderer();
