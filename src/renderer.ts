/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

declare global {
    interface Window {
        electronAPI: {
            downloadSSDLast: () => void;
            downloadSSDAll: () => void;
            downloadCoords: () => void;
        };
    }
}

// window.electronApi = window.electronApi || {};

import './index.css';

const ssdAllBtn = document.querySelector('.download-all');
const ssdLastBtn = document.querySelector('.download-last');
const coordsBtn = document.querySelector('.download-coords');

ssdAllBtn.addEventListener('click', () => window.electronAPI.downloadSSDAll());
ssdLastBtn.addEventListener('click', () => window.electronAPI.downloadSSDLast());
coordsBtn.addEventListener('click', () => window.electronAPI.downloadCoords());

// window.location = 'https://www.google.com/';
