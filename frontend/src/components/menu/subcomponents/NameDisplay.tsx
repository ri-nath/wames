import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import SuperStore from 'state/SuperStore';
import DB from 'state/DB';

type State = {
    name: string
}

export default class NameDisplay extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: 'Anonymous'
        }
    }

    componentDidMount() {
        this.setState({
            name: DB.getUsername()
        });

        DB.onSetUsername((new_username: string) => {
            this.setState({
                name: new_username
            });
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


