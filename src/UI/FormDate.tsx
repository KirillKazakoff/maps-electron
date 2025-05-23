import React from 'react';
import settingsStore, { FormDateT } from './stores/settingsStore';
import { observer } from 'mobx-react-lite';
import ButtonAction from './ButtonAction';

type PropsT = { date: FormDateT };

export const FormDate = observer(({ date }: PropsT) => {
    const onChange =
        (position: keyof FormDateT) => (e: React.SyntheticEvent<HTMLInputElement>) => {
            settingsStore.setDate(position, e.currentTarget.value);
        };

    return (
        <form className="form-date">
            <h3 className="form-header">Загрузить по дате</h3>
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

            <ButtonAction cls="form-btn" id="sendF16" params={[date]}>
                Загрузить по дате F16
            </ButtonAction>
            <ButtonAction cls="form-btn" id="sendF10Date" params={[date]}>
                Загрузить по дате F10
            </ButtonAction>
            <ButtonAction cls="form-btn" id="sendF19Date" params={[date]}>
                Загрузить по дате F19
            </ButtonAction>
        </form>
    );
});
