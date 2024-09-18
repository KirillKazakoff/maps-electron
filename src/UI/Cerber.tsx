import React from 'react';
import ButtonsBlock from './ButtonsBlock';
import ButtonAction from './ButtonAction';

export default function Cerber() {
    return (
        <div className="app">
            <h3 className="title-app">Cerber UI</h3>
            <form className="form">
                <div className="rest-controllers">
                    <ButtonsBlock>
                        <ButtonAction id="sendStartCerber">Запустить Цербер</ButtonAction>
                    </ButtonsBlock>
                </div>
            </form>
        </div>
    );
}
