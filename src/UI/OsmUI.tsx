import React from 'react';
import { observer } from 'mobx-react-lite';
import ButtonAction from './ButtonAction';
import { FormDate } from './FormDate';
import { FormInput } from './FormInput';
import { getDateObj } from './logic/getDate';
import ButtonsBlock from './ButtonsBlock';
import settingsStore from './stores/settingsStore';

export const OsmUI = observer(() => {
    const dateObj = getDateObj();

    return (
        <div className="app">
            <h3>Ручной запуск</h3>

            <div className="rest-controllers rest-first-stage">
                <ButtonsBlock>
                    <ButtonAction id="sendXMLF16">Переместить F16 ФС</ButtonAction>
                    <ButtonAction id="sendManual">Запустить выгрузку F16 вручную</ButtonAction>
                    <ButtonAction id="sendF16Company">F16 суда компании</ButtonAction>
                </ButtonsBlock>
                <ButtonsBlock>
                    <ButtonAction id="sendXMLF19">Переместить F19 ФС</ButtonAction>
                    <ButtonAction id="sendF19">Загрузить отчет F19</ButtonAction>
                </ButtonsBlock>
                <ButtonsBlock>
                    <ButtonAction id="sendF10">Загрузить отчет F10</ButtonAction>
                </ButtonsBlock>
                <ButtonsBlock isLast>
                    <ButtonAction id="sendManual">Запустить планировщик вручную</ButtonAction>
                </ButtonsBlock>

                <FormDate date={dateObj.fromDate(settingsStore.date)} />
                {/* <FormInput />  */}
            </div>
        </div>
    );
});
