import React from 'react';
import ButtonAction from './ButtonAction';
import { FormDate } from './FormDate';
import { Checkbox } from './CheckBox';

export default function App() {
    return (
        <div>
            <h1>Загрузить</h1>
            <form className="form">
                <Checkbox id="msi" title="МСИ" />
                <Checkbox id="trk" title="ТРК" />
                <Checkbox id="tranzit" title="МСИ Транзит" />
            </form>

            <div className="rest-controllers rest-first-stage">
                <ButtonAction id="downloadSSDFromMonth">
                    Загрузить с начала месяца
                </ButtonAction>
                <ButtonAction id="downloadSSDYear">Загрузить год</ButtonAction>
                <ButtonAction id="downloadSSDMonthFull">Загрузить декабрь</ButtonAction>
                <FormDate />
            </div>
        </div>
    );
}
