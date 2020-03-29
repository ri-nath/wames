import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ServerStore from 'server/ServerStore';

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
            name: ServerStore.getUsername()
        });

        ServerStore.onSetUsername((new_username: string) => {
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
        alignSelf: 'stretch',
        height: 25,
        backgroundColor: '#4fff86',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


