import './index.css';
import { CheckBoxSettingsT } from './utils/types';

declare global {
    interface Window {
        electronAPI: {
            downloadSSDLast: () => void;
            downloadSSDAll: () => void;
            downloadCoords: () => void;
            sendXMLSSD: () => void;

            sendSettings: (settings: CheckBoxSettingsT) => void;
        };
    }
}

const ssdAllBtn = document.querySelector('.download-all');
const ssdLastBtn = document.querySelector('.download-last');
const coordsBtn = document.querySelector('.download-coords');
const sendXMLSSDBtn = document.querySelector('.sendXMLSSD');

ssdAllBtn.addEventListener('click', () => window.electronAPI.downloadSSDAll());
ssdLastBtn.addEventListener('click', () => window.electronAPI.downloadSSDLast());
coordsBtn.addEventListener('click', () => window.electronAPI.downloadCoords());
sendXMLSSDBtn.addEventListener('click', () => window.electronAPI.sendXMLSSD());

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
