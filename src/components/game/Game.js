import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Stage from "./Stage";

import GameStore from '../state/GameStore';

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: 0,
        };
    }

    componentDidMount() {
        GameStore.onAddPoints(points => {
            this.setState({
                points: this.state.points + points,
            });
        });
    }

    render() {
        return (
            <View>
                <View style={styles.score}>
                    <Text style={styles.score_text}> { this.state.points } </Text>
                </View>
                <View style={styles.stage}>
                    <Stage/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    score: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    score_text: {
        fontSize: 40,
    },

    stage: {
        flex: 1,
    }
});