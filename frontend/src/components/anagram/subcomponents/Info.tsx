import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {State} from 'store/types';
import {isResolved} from 'util/Vow';
import {getConfig, lazyGetState} from 'util/Anagram';
import {connect} from 'react-redux';

type Props = {
    duration: number,
    words: string[],
    target_score: number,
}

type CState = {
    score: number,
    timer: number,
}

class Info extends Component<any, CState> {
    private interval_handles: number[];

    constructor(props: any) {
        super(props);

        this.state = {
            score: 0,
            timer: 0,
        };

        this.incrementScore = this.incrementScore.bind(this);
        this.incrementTimer = this.incrementTimer.bind(this);

        this.resetIntervals = this.resetIntervals.bind(this);
        this.removeIntervals = this.removeIntervals.bind(this);

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

        this.setState({
            timer: this.props.duration
        });
    }


    componentWillUnmount() {
        this.removeIntervals();
    }

    incrementScore() {
        if (this.state.score !== this.props.target_score) {
            this.setState({
                score: this.state.score > this.props.target_score ? this.state.score - 5 : this.state.score + 5
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
                        this.props.words.map((word: string, idx: number) =>
                            <Text style={styles.words_text} key={idx}>{ word.toUpperCase() }</Text>
                        )
                    }
                </View>
            </Fragment>
        )
    }
}

function mapStateToProps(state: State) {
    if (isResolved(state.anagram.active_game)) {
        return {
            // @ts-ignore
            duration: getConfig(state.anagram.active_game).duration,
            // @ts-ignore
            words: lazyGetState(state.anagram.active_game).words,
            // @ts-ignore
            target_score: lazyGetState(state.anagram.active_game).score
        }
    } else {
        return {
            duration: 0,
            words: [],
            target_score: 0,
        }
    }
}

export default connect(mapStateToProps)(Info);

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