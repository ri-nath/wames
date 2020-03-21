import React, { Component, Fragment } from 'react';

import NameDisplay from "./subcomponents/NameDisplay";
import Challenger from "./subcomponents/Challenger";
import GameBrowser from "./subcomponents/GameBrowser";

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };

        this.handleChangeName = this.handleChangeName.bind(this);
    }

    handleChangeName(text) {
        this.setState({
            name: text
        });
    }

    render() {
        return (
            <Fragment>
                <NameDisplay/>
                <Challenger  style={{ flex: 1 }}/>
                <GameBrowser style={{ flex: 1 }}/>
            </Fragment>
        )
    }
}