import React, { Fragment } from 'react';

import NameDisplay from "./subcomponents/NameDisplay";
import Challenger from "./subcomponents/Challenger";
import GameBrowser from "./subcomponents/GameBrowser";
import NameChanger from 'components/menu/subcomponents/NameChanger';

export default function MenuContainer() {
    return (
        <Fragment>
            <NameChanger style={{ flex: 2 }}/>
            <NameDisplay/>
            <Challenger  style={{ flex: 3 }}/>
            <GameBrowser style={{ flex: 3 }}/>
        </Fragment>
    )
}