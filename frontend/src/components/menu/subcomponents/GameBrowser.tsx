import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert, Platform} from 'react-native';

import AnagramStore from '../../../state/AnagramStore';
import SuperStore, { SuperState } from "../../../state/SuperStore";
import Anagram  from "../../../state/wrappers/Anagram";
import {User} from '../../../../types';

type State = {
    games: Anagram[]
}

export default class GameBrowser extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            games: []
        };
    }

    componentDidMount() {
        this.setState({
            games: AnagramStore.getGamesList()
        });

        AnagramStore.onUpdateGamesList((games_list: Anagram[]) => {
            this.setState({
                games: games_list
            });
        });
    }

    alert(game: Anagram) {
        if (Platform.OS === 'web') {
            alert(game.getPlayers().map((user: User) =>
                user.username + ' scored ' + game.getState(user.user_id).score + ', with: ' + game.getState(user.user_id).words.join(' '),)
                .join('\n'))
        } else {
            Alert.alert(
                game.getPlayers().map((user: User, iidx: number) =>
                    user.username + (game.getPlayers().length - 1 !== iidx ? 'vs ' : ' ')
                ).join(''),
                game.getPlayers().map((user: User) =>
                    user.username + ' scored ' + game.getState(user.user_id).score + ', with: ' + game.getState(user.user_id).words.join(' '),)
                    .join('\n'))
        }
    }

    render() {
        return (
            <View style={styles.view_games}>
                <Text style={styles.title}> Games </Text>
                {
                    this.state.games.map((game: Anagram, idx: number) =>
                        <View style={ styles.game_row } key={idx}>
                            {
                                game.getPlayers().map((user: User, iidx: number) =>
                                    <Text key={this.state.games.length + iidx}>
                                        {user.username + (game.getPlayers().length - 1 !== iidx ? ' vs. ' : ' ')}
                                    </Text>
                                )
                            }
                            {
                                game.getLocalState().stage === 'FINISHED' ?
                                    <TouchableOpacity
                                        style={ styles.button }
                                        onPress={ () => {
                                            this.alert(game);
                                        } }
                                    >
                                        <Text>View Results</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={ styles.button }
                                        disabled={ game.getLocalState().stage !== 'NOT-STARTED' }
                                        onPress={ () => {SuperStore.setState(SuperState.ANAGRAM_GAME, game)} }
                                    >
                                        <Text>{ game.getLocalState().stage }</Text>
                                    </TouchableOpacity>

                            }
                        </View>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view_games: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        marginVertical: 50,
    },

    game_row: {
        marginVertical: 5,
        flexDirection: 'row'
    },

    title: {
        marginBottom: 10,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: '#DDDDDD',
    }
});


