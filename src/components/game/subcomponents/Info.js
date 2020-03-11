import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import GameStore from '../../../state/GameStore';

export default class Info extends Component {
    constructor(props) {
        super(props);

        this.state = {
            score: 0
        }
    }

    componentDidMount() {
        GameStore.onAddPoints(points => {
            this.setState({
                score: this.state.score + points,
            })
        });
    }

    componentWillUnmount() {
        GameStore.stopListeningForPoints();
    }

    render() {
        return (
            <Text style={styles.score_text}> { this.state.score } </Text>
        )
    }
}

const styles = StyleSheet.create({
    score_text: {
        fontSize: 20,
    }
});