import '../index.css';
import { createRoot } from 'react-dom/client';
import { ElectronApiT } from '../preload';
import { App } from './App';
import React from 'react';

declare global {
    interface Window {
        electronAPI: ElectronApiT;
    }
}

const root = createRoot(document.getElementById('app-container') as HTMLElement);
root.render(<App />);
