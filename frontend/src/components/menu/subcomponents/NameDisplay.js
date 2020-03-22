import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import DB from '../../../state/DB';
import Centralizer from '../../../state/Centralizer';

export default class NameDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'Anonymous'
        }
    }

    componentDidMount() {
        this.setState({
            name: Centralizer.getUsername()
        });

        DB.onSetUsername(new_username => {
            this.setState(new_username);
        });
    }

    render() {
        return (
        <View style={styles.name}>
            <Text> Playing as: { this.state.name } </Text>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    name: {
        height: 25,
        backgroundColor: '#4fff86',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


