import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';

import ServerStore from 'server/ServerStore';

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
        ServerStore.setUsername(this.state.value);
    }

    componentDidMount() {
        const username = ServerStore.getUsername();

        this.setState({
            value: username,
            username: username
        });

        ServerStore.onSetUsername(this.handleChangeValue);
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
                    disabled={this.state.value.length < 1 || this.state.value === this.state.username}
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
        justifyContent: 'center',
    },

    button: {
        backgroundColor: '#DEC0F1',
        padding: 5,
        borderRadius: 10
    }
});


