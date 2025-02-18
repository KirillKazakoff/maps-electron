import React from 'react';
import ButtonAction from './ButtonAction';
import ButtonsBlock from './ButtonsBlock';

export default function PowerAUI() {
    return (
        <div className="app">
            <h3 className="title-app">Power AUI</h3>
            <form className="form">
                <div className="rest-controllers">
                    <ButtonsBlock>
                        <ButtonAction id="sendUpdateRegister">Обновить реестры</ButtonAction>
                        <ButtonAction id="sendUpdateRDO">Обновить РДО</ButtonAction>
                        <ButtonAction id="sendPlannerRegisterMd">
                            Запустить планировщик реестры + РДО
                        </ButtonAction>
                        <ButtonAction id="sendUnsignedReestr">
                            Отправить список неподписанных документов
                        </ButtonAction>
                    </ButtonsBlock>
                    <ButtonsBlock isLast>
                        <ButtonAction id="sendUpdateMd">Обновить базу ССД</ButtonAction>
                        <ButtonAction id="sendUpdateModel">
                            Обновить модель данных
                        </ButtonAction>
                        <ButtonAction id="sendUpdateQuotes">Обновить квоты</ButtonAction>
                        <ButtonAction id="sendUpdateF19QuerryReport">
                            Обновить отчет на основе F19
                        </ButtonAction>
                        <ButtonAction id="sendReportDebug">Отправить отчет TG</ButtonAction>
                        <ButtonAction id="sendUpdateModelAll">
                            База -- Модель -- Квоты -- TG
                        </ButtonAction>
                    </ButtonsBlock>
                </div>
            </form>
        </div>
    );
}
