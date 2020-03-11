import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';

import Stage from "./subcomponents/Stage";
import Info from "./subcomponents/Info";

export default class GameContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: 0,
        };
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
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    stage: {
        flex: 1,
    }
});