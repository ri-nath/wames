import React, { Component } from 'react';
import {StyleSheet, Button, View} from 'react-native';

import SuperStore from '../../state/SuperStore';

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: 0,
        };
    }

    render() {
        return (
            <View>
                <Button title='play' onPress={_ => SuperStore.startAnagramGame()}/>
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