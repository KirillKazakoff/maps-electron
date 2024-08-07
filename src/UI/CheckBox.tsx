import React, { useEffect, useState } from 'react';
import settingsStore from './stores/settingsStore';
import { observer } from 'mobx-react-lite';
import _ from 'lodash';

type PropsT = { id: string; title: string };

export const Checkbox = observer(({ id, title }: PropsT) => {
    const settings = settingsStore.getSettingsByName(id);
    const [isChecked, setChecked] = useState(settings?.isChecked || false);

    useEffect(() => {
        if (!settings) return;
        setChecked(settings.isChecked);
    }, [settings]);

    if (!settings) return;

    const onChange = () => {
        const cloneSettings = _.cloneDeep(settings);
        cloneSettings.isChecked = !isChecked;
        window.electronAPI.sendSettings(cloneSettings as any);

        setChecked(!isChecked);
    };

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
