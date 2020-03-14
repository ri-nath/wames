import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import AnagramStore from '../../../state/AnagramStore';
import AnagramInstance from '../../../state/AnagramInstance';

export default class Info extends Component {
    constructor(props) {
        super(props);

        this.state = {
            score: 0,
            target_score: 0,
            timer: 0,
            show_timer: true,
            words: [],
        };

        this.countScoreUp = this.countScoreUp.bind(this);
        this.countTimerDown = this.countTimerDown.bind(this);

        this.resetIntervals = this.resetIntervals.bind(this);
        this.removeIntervals = this.removeIntervals.bind(this);

        this.setInfoFromGameState = this.setInfoFromGameState.bind(this);

        this.intervals = [];

        this.resetIntervals();
    }

    resetIntervals() {
        this.removeIntervals();

        this.intervals.push(
            setInterval(this.countScoreUp, 5), // 5 ms
            setInterval(this.countTimerDown, 1000) // 1 second
        );
    }

    removeIntervals() {
        for (let interval of this.intervals) {
            clearInterval(interval);
        }

        this.intervals = [];
    }

    componentDidMount() {
        this.resetIntervals();

        const game_obj = AnagramStore.active_game;
        this.setInfoFromGameState(game_obj.state);

        AnagramStore.onScoreWord(game_obj => {
            this.setInfoFromGameState(game_obj.state);
        });

        AnagramStore.onEndGame(game_obj => {
            this.setInfoFromGameState(game_obj.state);
        });
    }

    setInfoFromGameState(state) {
        this.setState({
            target_score: state.score,
            timer: state.time,
            show_timer: state.running,
            words: state.words,
        });
    }

    componentWillUnmount() {
        this.removeIntervals();
    }

    countScoreUp() {
        if (this.state.score !== this.state.target_score) {
            this.setState({
                score: this.state.score > this.state.target_score ? this.state.score - 10 : this.state.score + 10
            });
        }
    }

    countTimerDown() {
        if (this.state.timer > 0) {
            this.setState({
                timer: this.state.timer - 1
            });
        }
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.show_timer &&
                    <View style={styles.timer}>
                        <Text style={styles.timer_text}> { this.state.timer + 's' } </Text>
                    </View>
                }
                <View style={styles.score}>
                    <Text style={styles.score_text}> { this.state.score } </Text>
                </View>
                <View style={styles.words}>
                    {
                        this.state.words.map((word, idx) =>
                            <Text key={idx}>{ word.toUpperCase() }</Text>
                        )
                    }
                </View>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    timer_text: {
        fontSize: 30,
    },

    timer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    score_text: {
        fontSize: 60,
    },

    score: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    words: {
        flex: 3,
        alignItems: 'center',
    }
});