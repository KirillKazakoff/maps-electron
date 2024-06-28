import React from 'react';
import ButtonAction from './ButtonAction';
import { FormDate } from './FormDate';
import { Checkbox } from './CheckBox';
import { getDateObj } from './logic/getDate';
import { observer } from 'mobx-react-lite';
import { FormInput } from './FormInput';

export const App = observer(() => {
    const dateObj = getDateObj();

    return (
        <div>
            <h1>Загрузить</h1>
            <form className="form">
                <Checkbox id="company" title="Компания" />
                <Checkbox id="liveCrab" title="Живой краб" />
            </form>

            <div className="rest-controllers rest-first-stage">
                <ButtonAction id="sendXMLSSD">Переименовать ССД ФС</ButtonAction>
                <ButtonAction id="sendManual">Запустить задачу вручную</ButtonAction>
                <ButtonAction id="sendManual">KNOPKA</ButtonAction>

                <FormDate date={dateObj.fromDatePicker()} />
                <FormInput />
            </div>
        </div>
    );
});
