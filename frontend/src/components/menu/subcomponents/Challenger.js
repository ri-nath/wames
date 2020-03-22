import React, { Component } from 'react';
import {StyleSheet, View, TextInput, Button} from 'react-native';

import DB from '../../../state/DB';

export default class Challenger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    handleChangeValue(value) {
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
                    onPress={_ => DB.createGame(this.state.value)}
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


