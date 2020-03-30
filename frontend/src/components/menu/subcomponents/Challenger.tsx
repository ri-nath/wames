import React, { Component } from 'react';
import {StyleSheet, View, TextInput, Button} from 'react-native';

import { AnagramObject } from '../../../../types';

import ServerStore from 'server/ServerStore';
import RootNavigator from 'state/RootNavigator';

import Anagram from 'lib/Anagram';

type State = {
    value: string
}

export default class Challenger extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    handleChangeValue(value: string) {
        this.setState({
            value: value
        });
    }

    render() {
        return (
            <View style={styles.create_game}>
                <TextInput
                    placeholder='Opponent Username'
                    value={this.state.value}
                    onChangeText={this.handleChangeValue}
                />
                <Button
                    disabled={this.state.value.length < 1}
                    title='Challenge User'
                    onPress={() => ServerStore.createGame([this.state.value], (game: AnagramObject) => {
                        RootNavigator.navigateToAnagramInfo(new Anagram(game, ServerStore.getUserID()));
                    })}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    create_game: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});


