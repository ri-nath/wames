import { AnagramObject } from '../../../../types';

import React, { Component } from 'react';
import {StyleSheet, View, TextInput, Button} from 'react-native';

import DB from '../../../state/DB';
import SuperStore, { SuperState } from 'state/SuperStore';
import Anagram from 'state/wrappers/Anagram';

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
                    onPress={() => DB.createGame([this.state.value], (game: AnagramObject) => {
                        SuperStore.setStateToAnagramGame(new Anagram(game, DB.getUserID()))
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

    button: {
        backgroundColor: '#DEC0F1',
        padding: 5,
        borderRadius: 10
    }
});


