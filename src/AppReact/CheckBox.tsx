import React, { useEffect, useState } from 'react';
import settingsStore from './stores/settingsStore';
import { observer } from 'mobx-react-lite';

type PropsT = { id: string; title: string };

export const Checkbox = observer(({ id, title }: PropsT) => {
    const settings = settingsStore.getSettingsByName(id);
    const [isChecked, setChecked] = useState(settings?.isChecked || false);

    useEffect(() => {
        if (!settings) return;
        setChecked(settings.isChecked);
    }, [settings]);

    if (!settings) return;

    const onChange = () => setChecked(!isChecked);

    return (
        <div className="checkbox-row">
            <label htmlFor={id}>{title}</label>
            <input
                id={id}
                type="checkbox"
                className="checkbox"
                onChange={onChange}
                checked={isChecked}
            />
        </div>
    );
});
