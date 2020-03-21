import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import SuperStore from '../../../state/SuperStore';

export default class NameDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'Anonymous'
        }
    }

    componentDidMount() {
        this.setState({
            name: SuperStore.db.user_id
        });

        SuperStore.db.onSetUsername(new_user_id => {
            this.setState(new_user_id);
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


