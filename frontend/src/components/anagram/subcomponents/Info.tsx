import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import AnagramStore from 'state/AnagramStore';
import Anagram from 'wrappers/Anagram';

type State = {
    score: number,
    target_score: number,
    timer: number,
    words: string[]
}

export default class Info extends Component<any, State> {
    private interval_handles: number[];

    constructor(props: any) {
        super(props);

        this.state = {
            score: 0,
            target_score: 0,
            timer: 0,
            words: [],
        };

        this.incrementScore = this.incrementScore.bind(this);
        this.incrementTimer = this.incrementTimer.bind(this);

        this.resetIntervals = this.resetIntervals.bind(this);
        this.removeIntervals = this.removeIntervals.bind(this);

        this.updateInfoFromGameInstance = this.updateInfoFromGameInstance.bind(this);

        this.interval_handles = [];

        this.resetIntervals();
    }

    resetIntervals() {
        this.removeIntervals();

        this.interval_handles.push(
            setInterval(this.incrementScore, 5), // 5 ms
            setInterval(this.incrementTimer, 1000) // 1 second
        );
    }

    removeIntervals() {
        for (let interval of this.interval_handles) {
            clearInterval(interval);
        }

        this.interval_handles = [];
    }

    componentDidMount() {
        this.resetIntervals();

        const game_obj: Anagram = AnagramStore.getActiveGame();
        this.updateInfoFromGameInstance(game_obj);

        this.setState({
            timer: game_obj.getConfig().duration
        });

        AnagramStore.onScoreWord((game_obj: Anagram) => {
            this.updateInfoFromGameInstance(game_obj);
        });
    }

    updateInfoFromGameInstance(game_obj: Anagram) {
        // TODO: type
        const game_state = game_obj.getLocalState();

        this.setState({
            target_score: game_state.score,
            words: game_state.words,
        });
    }

    componentWillUnmount() {
        this.removeIntervals();
    }

    incrementScore() {
        if (this.state.score !== this.state.target_score) {
            this.setState({
                score: this.state.score > this.state.target_score ? this.state.score - 10 : this.state.score + 10
            });
        }
    }

    incrementTimer() {
        if (this.state.timer > 0) {
            this.setState({
                timer: this.state.timer - 1
            });
        }
    }

    render() {
        return (
            <Fragment>
                    <View style={styles.timer}>
                        <Text style={styles.timer_text}> { this.state.timer + 's' } </Text>
                    </View>
                <View style={styles.score}>
                    <Text style={styles.score_text}> { this.state.score } </Text>
                </View>
                <View style={styles.words}>
                    {
                        this.state.words.map((word: string, idx: number) =>
                            <Text style={styles.words_text} key={idx}>{ word.toUpperCase() }</Text>
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

    words_text: {
        fontSize: 10,
    },

    words: {
        flex: 3,
        alignItems: 'center',
    }
});