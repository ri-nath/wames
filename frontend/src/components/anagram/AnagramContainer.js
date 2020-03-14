import React, { Component, Fragment } from 'react';
import {StyleSheet, Button, View} from 'react-native';

import Stage from "./subcomponents/Stage";
import Info from "./subcomponents/Info";

import AnagramStore from "../../state/AnagramStore";
import SuperStore from "../../state/SuperStore";

export default class AnagramContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            in_game: false
        }
    }

    componentDidMount() {
        this.setState({
            in_game: true,
        });

        AnagramStore.onEndGame(_ => {
            this.setState({
                in_game: false
            })
        });
    }

    componentWillUnmount() {
        AnagramStore.closeAllListeners();
    }

    render() {
        if (this.state.in_game) {
            return (
                <Fragment>
                    <View style={styles.info}>
                        <Info/>
                    </View>
                    <View style={styles.stage}>
                        <Stage/>
                    </View>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <View style={styles.info}>
                        <Info/>
                    </View>
                    <View style={styles.stage}>
                        <Button title='MENU' onPress={_ => {SuperStore.stateToMenu()}}/>
                    </View>
                </Fragment>
            )
        }
    }
}

const styles = StyleSheet.create({
    info: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    stage: {
        flex: 2,
    }
});