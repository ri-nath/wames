import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { User } from '../../../../types';
import { RootStackParamList } from '../MenuContainer';

import SuperStore from 'state/SuperStore';
import AnagramStore from 'state/AnagramStore';
import Anagram from 'lib/Anagram';

type AnagramPortalRouteProp = RouteProp<RootStackParamList, 'Anagram'>;

type Props = {
    route: AnagramPortalRouteProp,
}

export default class GamePortal extends Component<Props, any> {
    private readonly game: Anagram;

    constructor(props: Props) {
        super(props);

        const { game } = this.props.route.params;

        this.game = game;
    }

    componentDidMount(): void {
        AnagramStore.markGameAsViewed(this.game);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{ this.game.getDate() } </Text>
                <Text> Anagram Game </Text>
                {
                    this.game.getLocalState().stage === 'NOT-STARTED' ?
                        <Fragment>
                            <View style={{flex: 1, justifyContent: "flex-start"}}>
                                <Text style={styles.name}>
                                    {
                                        this.game.getPlayers().map((user: User, idx: number) =>
                                            user.username + (this.game.getPlayers().length - 1 !== idx ? ' vs. ' : ' ')
                                        )
                                    }
                                </Text>
                            </View>
                            <View style={{flex: 3, justifyContent: "center"}}>
                                <TouchableOpacity
                                    style={styles.play_button}
                                    onPress={() => SuperStore.setStateToAnagramGame(this.game)}>
                                    <Text style={styles.play_button_text}>Play</Text>
                                </TouchableOpacity>
                            </View>
                        </Fragment>
                        :
                        <View style={styles.user_cols}>
                            {
                                this.game.getPlayers().map((user: User, idx: number) => {
                                    const state = this.game.getState(user.user_id);

                                    if (state.stage === 'NOT-STARTED') {
                                        return (
                                            <View
                                                key={idx}
                                                style={styles.user_data}>
                                                <Text style={styles.name}> {user.username}</Text>
                                                <Text> Challenge sent... </Text>
                                            </View>
                                        );
                                    } else if (state.stage === 'FINISHED') {
                                        return (
                                            <View
                                                key={idx}
                                                style={styles.user_data}>
                                                <Text style={styles.name}> {user.username}</Text>
                                                <Text style={styles.score}> {state.score}</Text>
                                                {
                                                    state.words.map((word, iidx) =>
                                                        <Text key={iidx}> {word.toUpperCase()} </Text>
                                                    )
                                                }
                                            </View>
                                        );
                                    }
                                })
                            }
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    user_cols: {
        flex: 1,
        flexDirection: 'row',
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    play_button: {
        backgroundColor: 'lime',
        borderRadius: 10,
        margin: 0,
    },

    play_button_text: {
        padding: 30,
        fontSize: 80,
    },

    user_data: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        borderLeftColor: 'gray',
        borderRightColor: 'gray',
        borderWidth: StyleSheet.hairlineWidth
    },

    // Make this dynamic
    name: {
        fontSize: 25,
    },

    score: {
        fontSize: 50
    }
});
