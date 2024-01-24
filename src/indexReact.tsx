import './index.css';
import { createRoot } from 'react-dom/client';
import { ElectronApi } from './preload';
import App from './AppReact/App';

declare global {
    interface Window {
        electronAPI: ElectronApi;
    }
}

const root = createRoot(document.getElementById('app-container'));
root.render(<App />);
