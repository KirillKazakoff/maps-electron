import React from 'react';
import ButtonAction from './ButtonAction';
import { FormDate } from './FormDate';
import { Checkbox } from './CheckBox';
import { getDateObj } from './logic/getDate';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
    const dateObj = getDateObj();

    return (
        <div>
            <h1>Загрузить</h1>
            <form className="form">
                <Checkbox id="msi" title="МСИ" />
                <Checkbox id="trk" title="ТРК" />
                <Checkbox id="tranzit" title="МСИ Транзит" />
                <Checkbox id="dv" title="Дальневосточное побережье" />
                <Checkbox id="others" title="Другие" />
            </form>

            <div className="rest-controllers rest-first-stage">
                <ButtonAction id="downnloadSSDDate" params={[dateObj.fromLastMonth()]}>
                    Загрузить с начала месяца
                </ButtonAction>
                <ButtonAction id="sendXMLSSD">Переименовать ССД ФС</ButtonAction>
                <FormDate date={dateObj.fromDatePicker()} />
            </div>
        </div>
    );
});
