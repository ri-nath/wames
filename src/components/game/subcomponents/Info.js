import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import GameStore from '../../../state/GameStore';
import GameDB from '../../../state/GameDB';

export default class Info extends Component {
    constructor(props) {
        super(props);

        this.state = {
            score: 0,
            target_score: 0,
        };

        this.countScoreUp = this.countScoreUp.bind(this);
    }

    componentDidMount() {
        GameStore.onScoreWord(_ => {
            this.setState({
                target_score: GameDB.getScore()
            });

            setTimeout(this.countScoreUp, 5);
        });

        GameStore.onStartNewGame(_ => {
            this.setState({
                score: 0,
                target_score: 0,
            });

            setTimeout(this.countScoreUp, 5);
        })
    }

    componentWillUnmount() {
        GameStore.stopListeningForWords();
        GameStore.stopListeningForNewGame();
    }

    countScoreUp() {
        if (this.state.score < this.state.target_score) {
            this.setState({
                score: this.state.score + 1
            });

            setTimeout(this.countScoreUp, 5);
        }
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    words: {
        flex: 4,
        alignItems: 'center',
    }
});