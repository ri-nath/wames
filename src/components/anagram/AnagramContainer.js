import React, { Component } from 'react';
import {StyleSheet, Button, View} from 'react-native';

import Stage from "./subcomponents/Stage";
import Info from "./subcomponents/Info";

import SuperStore from '../../state/SuperStore';

export default class AnagramContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: 0,
        };

        SuperStore.startAnagramGame();
    }

    render() {
        return (
            <View>
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
    info: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    stage: {
        flex: 2,
    }
});