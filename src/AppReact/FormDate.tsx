import React from 'react';
import settingsStore, { FormDateT } from './stores/settingsStore';
import { observer } from 'mobx-react-lite';
import ButtonAction from './ButtonAction';

export const FormDate = observer(() => {
    const onChange =
        (position: keyof FormDateT) => (e: React.SyntheticEvent<HTMLInputElement>) => {
            settingsStore.setDate(position, e.currentTarget.value);
        };

    return (
        <form className="form-date">
            <h3>Форма загрузки по дате</h3>
            <div className="form-date-inputs">
                <input
                    id="date-start"
                    type="date"
                    onChange={onChange('start')}
                    value={settingsStore.date.start}
                />
                <input
                    id="date-end"
                    type="date"
                    onChange={onChange('end')}
                    value={settingsStore.date.end}
                />
            </div>

            <ButtonAction id="downnloadSSDDate" params={[settingsStore.date]}>
                Загрузить по дате
            </ButtonAction>
        </form>
    );
});
