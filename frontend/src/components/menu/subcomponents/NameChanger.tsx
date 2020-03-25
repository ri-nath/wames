import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';

import DB from '../../../state/DB';
import { User } from '../../../../types';
import SuperStore from 'state/SuperStore';

type State = {
    username: string,
    value: string
}


export default class NameChanger extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            username: '',
            value: '',
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handlePress = this.handlePress.bind(this);
    }

    handleChangeValue(value: string) {
        this.setState({
            value: value
        });
    }

    handlePress() {
        DB.setUsername(this.state.value);
    }

    componentDidMount() {
        const username = DB.getUsername();

        this.setState({
            value: username,
            username: username
        });

        DB.onSetUsername(this.handleChangeValue);
    }

    render() {
        return (
            <View style={styles.create_game}>
                <TextInput
                    placeholder='Username'
                    value={this.state.value}
                    onChangeText={this.handleChangeValue}
                />
                <Button
                    disabled={this.state.value.length < 1}
                    title='Confirm New Username'
                    onPress={this.handlePress}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    create_game: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    button: {
        backgroundColor: '#DEC0F1',
        padding: 5,
        borderRadius: 10
    }
});


