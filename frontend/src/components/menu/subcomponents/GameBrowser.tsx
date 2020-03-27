import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, FlatList, Dimensions } from 'react-native';

import { User } from '../../../../types';

import AnagramStore from 'state/AnagramStore';
import SuperStore  from "state/SuperStore";
import Anagram  from "wrappers/Anagram";

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
                <FlatList
                    style={styles.list}
                    data={this.state.games.reverse()}
                    extraData={this.state}
                    keyExtractor={(item) => item.getID()}
                    renderItem={({item}) =>
                        <View style={styles.game_row}>
                            {
                                item.getPlayers().map((user: User, iidx: number) =>
                                    <Text key={this.state.games.length + iidx}>
                                        {user.username + (item.getPlayers().length - 1 !== iidx ? ' vs. ' : ' ')}
                                    </Text>
                                )
                            }
                            {
                                item.getLocalState().stage === 'FINISHED' ?
                                    <TouchableOpacity
                                        style={ styles.button }
                                        onPress={ () => {
                                            this.alert(item);
                                        } }
                                    >
                                        <Text>View Results</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={ styles.button }
                                        disabled={ item.getLocalState().stage !== 'NOT-STARTED' }
                                        onPress={ () => {SuperStore.setStateToAnagramGame(item)} }
                                    >
                                        <Text>{ item.getLocalState().stage }</Text>
                                    </TouchableOpacity>

                            }
                        </View>
                    }
                />
            </View>
        )
    }
}

const height = Dimensions.get('window').height;

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
    },

    list: {
        flexGrow: 0,
        height: height * 0.4
    }
});


