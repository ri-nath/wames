import React, { Component } from 'react';
import {StyleSheet, Button, View} from 'react-native';

import Stage from "./subcomponents/Stage";
import Info from "./subcomponents/Info";

import GameStore from '../../state/GameStore';

export default class GameContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: 0,
        };

        GameStore.startNewGame();
    }

    render() {
        return (
            <View>
                <View style={styles.debug}>
                    <Button onPress={_ => GameStore.startNewGame()} title='DEBUG'/>
                </View>
                <View style={styles.info}>
                    <Info/>
                </View>
                <View style={styles.stage}>
                    <Stage/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    debug: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    info: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    stage: {
        flex: 2,
    }
});