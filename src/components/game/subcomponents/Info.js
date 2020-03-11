import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import GameStore from '../../../state/GameStore';
import GameDB from '../../../state/GameDB';

export default class Info extends Component {
    constructor(props) {
        super(props);

        this.state = {
            score: 0
        }
    }

    componentDidMount() {
        GameStore.onScoreWord((word) => {
            const points = word.length * 10;

            this.setState({
                score: this.state.score + points,
            })
        });
    }

    componentWillUnmount() {
        GameStore.stopListeningForWords();
    }

    render() {
        return (
            <Fragment>
                <View style={styles.score}>
                    <Text style={styles.score_text}> { this.state.score } </Text>
                </View>
                <View style={styles.words}>
                    {
                        GameDB.words.map((word, idx) =>
                            <Text key={idx}>{ word.toUpperCase() }</Text>
                        )
                    }
                </View>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    score_text: {
        fontSize: 60,
    },

    score: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    words: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});