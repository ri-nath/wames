import React, { Component } from 'react';
import {StyleSheet, Button, View} from 'react-native';

import Stage from "./subcomponents/Stage";
import Info from "./subcomponents/Info";

import AnagramStore from "../../state/AnagramStore";

export default class AnagramContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        AnagramStore.closeAllListeners();
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