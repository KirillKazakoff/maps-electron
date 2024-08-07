import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Osm } from './Osm';
import PowerAUI from './PowerAUI';

export const App = observer(() => {
    const [state, setState] = useState('osm');

    const onClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const value = e.currentTarget.textContent.toLowerCase();
        setState(value);
    };

    const Output = state === 'osm' ? Osm : PowerAUI;

    return (
        <div className="container">
            <div className="links">
                <div className="router-link" onClick={onClick}>
                    OSM
                </div>
                <div className="router-link" onClick={onClick}>
                    Power Automate
                </div>
            </div>

            <Output />
        </div>
    );
});
