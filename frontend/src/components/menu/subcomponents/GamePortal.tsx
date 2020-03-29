import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { User } from '../../../../types';

import SuperStore from 'state/SuperStore';

import { RootStackParamList } from '../MenuContainer';

type AnagramPortalRouteProp = RouteProp<RootStackParamList, 'Anagram'>;

type Props = {
    route: AnagramPortalRouteProp,
}

export default class GamePortal extends Component<Props, any> {
    render() {
        const { game } = this.props.route.params;

        if (game.getLocalState().stage === 'NOT-STARTED') {
            return (
                <View style={styles.not_started}>
                    <View style={{flex: 1, justifyContent: "flex-start"}}>
                        <Text style={styles.name}>
                            {
                                game.getPlayers().map((user: User, iidx: number) =>
                                    user.username + (game.getPlayers().length - 1 !== iidx ? ' vs. ' : ' ')
                                )
                            }
                        </Text>
                    </View>
                    <View style={{flex: 3, justifyContent: "center"}}>
                        <TouchableOpacity
                            style={styles.play_button}
                            onPress={() => SuperStore.setStateToAnagramGame(game)}>
                            <Text style={styles.play_button_text}>Play</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (game.getLocalState().stage === 'FINISHED') {
            return (
                <View style={styles.container}>
                    {
                        game.getPlayers().map((user: User) => {
                            const state = game.getState(user.user_id);

                            if (state.stage === 'NOT-STARTED') {
                                return (
                                    <View style={styles.user_data}>
                                        <Text style={styles.name}> {user.username}</Text>
                                        <Text> Challenge sent... </Text>
                                    </View>
                                );
                            } else if (state.stage === 'FINISHED') {
                                return (
                                    <View style={styles.user_data}>
                                        <Text style={styles.name}> {user.username}</Text>
                                        <Text style={styles.score}> {state.score}</Text>
                                        { state.words.map(word => <Text> {word.toUpperCase()} </Text>) }
                                    </View>
                                );
                            }
                        })
                    }
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },

    not_started: {
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
