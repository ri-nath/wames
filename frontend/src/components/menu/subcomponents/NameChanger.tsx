import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';

import DB from '../../../state/DB';
import Centralizer from '../../../state/Centralizer';

type State = {
    value: string
}


export default class NameChanger extends Component<any, State> {
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

    componentDidMount() {
        this.setState({
            value: Centralizer.getUsername()
        });

        DB.onSetUsername((username: string) => {
            this.setState({
                value: username
            });
        })
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
                    onPress={_ => DB.setUsername(this.state.value)}
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


