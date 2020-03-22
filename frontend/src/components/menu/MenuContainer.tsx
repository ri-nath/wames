import React, { Fragment } from 'react';

import NameDisplay from "./subcomponents/NameDisplay";
import Challenger from "./subcomponents/Challenger";
import GameBrowser from "./subcomponents/GameBrowser";

export default function MenuContainer() {
    return (
        <Fragment>
            <NameDisplay/>
            <Challenger  style={{ flex: 1 }}/>
            <GameBrowser style={{ flex: 1 }}/>
        </Fragment>
    )
}