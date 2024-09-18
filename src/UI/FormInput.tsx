import React from 'react';
import { observer } from 'mobx-react-lite';
import settingsStore from './stores/settingsStore';
import ButtonAction from './ButtonAction';

export const FormInput = observer(() => {
    const onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        settingsStore.setSchedule(e.currentTarget.value);
    };

    return (
        <form className="form-date">
            <h3 className="form-header">Запустить планировщик</h3>
            <div className="form-date-inputs">
                <input
                    id="schedule"
                    type="text"
                    value={settingsStore.schedule}
                    onChange={onChange}
                />
            </div>

            <ButtonAction cls="form-btn" id="sendPlanner" params={[settingsStore.schedule]}>
                Запустить планировщик
            </ButtonAction>
        </form>
    );
});
