import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Osm } from './Osm';
import PowerAUI from './PowerAUI';
import Cerber from './Cerber';

export const App = observer(() => {
    const [tab, setTab] = useState('osm');
    const [status, setStatus] = useState('');

    useEffect(() => {
        window.electronAPI.getDevStatus().then((res) => {
            const status = res ? 'Development' : 'Production';
            setStatus(status.toUpperCase());
        });
    }, []);

    const onClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const value = e.currentTarget.textContent.toLowerCase();
        setTab(value);
    };

    if (!status) return null;
    console.log(status);

    let Output: () => JSX.Element;

    if (tab === 'osm') {
        Output = Osm;
    }
    if (tab === 'power automate') {
        Output = PowerAUI;
    }
    if (tab === 'cerber') {
        Output = Cerber;
    }

    const title = document.getElementsByTagName('title');
    title.item(0).textContent = status;

    return (
        <div className={status === 'DEVELOPMENT' ? 'container-dev' : 'container'}>
            <div className="links">
                <div className="router-link" onClick={onClick}>
                    OSM
                </div>
                <div className="router-link" onClick={onClick}>
                    Power Automate
                </div>
                <div className="router-link" onClick={onClick}>
                    Cerber
                </div>
            </div>

            <Output />
        </div>
    );
});
