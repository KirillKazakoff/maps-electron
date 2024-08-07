import React from 'react';
import ButtonAction from './ButtonAction';

export default function PowerAUI() {
    return (
        <div className="app">
            <h1 className="title-app">Power AUI</h1>
            <form className="form">
                <div className="rest-controllers">
                    <ButtonAction id="sendUpdateRegister">Обновить реестры</ButtonAction>
                    <ButtonAction id="sendUpdateMd">Обновить базу ССД</ButtonAction>
                    <ButtonAction id="sendPlannerRegisterMd">
                        Запустить планировщик регистры + база ССД
                    </ButtonAction>
                </div>
            </form>
        </div>
    );
}
