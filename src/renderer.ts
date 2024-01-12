import './index.css';
import { ElectronApi } from './preload';

declare global {
    interface Window {
        electronAPI: ElectronApi;
    }
}

[
    'sendXMLSSD',
    'downloadSSDLast',
    'downloadSSDFromMonth',

    'downloadCoords',
    'downloadSSDAll',
    'onlyDownload',
].forEach((action: keyof typeof window.electronAPI.api) => {
    const btn = document.querySelector('.' + action);
    const action2 = action;
    btn.addEventListener('click', () => window.electronAPI.api[action2]());
});

window.electronAPI.api.getPath().then((res) => console.log(res));

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
    });
