import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import AnagramStore from '../../../state/AnagramStore';
import AnagramDB from '../../../state/AnagramDB';

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
        AnagramStore.onScoreWord(_ => {
            this.setState({
                target_score: AnagramDB.getScore()
            });

            setTimeout(this.countScoreUp, 5);
        });

        AnagramStore.onStartNewGame(_ => {
            this.setState({
                score: 0,
                target_score: 0,
            });

            setTimeout(this.countScoreUp, 5);
        })
    }

    componentWillUnmount() {
        AnagramStore.stopListeningForWords();
        AnagramStore.stopListeningForNewGame();
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
                        AnagramDB.words.map((word, idx) =>
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