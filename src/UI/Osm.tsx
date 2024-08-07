import React from 'react';
import { observer } from 'mobx-react-lite';
import ButtonAction from './ButtonAction';
import { Checkbox } from './CheckBox';
import { FormDate } from './FormDate';
import { FormInput } from './FormInput';
import { getDateObj } from './logic/getDate';

export const Osm = observer(() => {
    const dateObj = getDateObj();

    return (
        <div className="app">
            <form className="form">
                <Checkbox id="company" title="Компания" />
                <Checkbox id="liveCrab" title="Живой краб" />
            </form>

            <h3>Ручной запуск</h3>
            <div className="rest-controllers rest-first-stage">
                <ButtonAction id="sendXMLSSD">Переименовать ССД ФС</ButtonAction>
                <ButtonAction id="sendManual">Запустить выгрузку вручную</ButtonAction>
                <ButtonAction id="sendF19">Загрузить отчет F19</ButtonAction>
                <ButtonAction id="sendXMLF19">Переименовать F19 ФС</ButtonAction>

                <FormDate date={dateObj.fromDatePicker()} />
                <FormInput />
            </div>
        </div>
    );
});
