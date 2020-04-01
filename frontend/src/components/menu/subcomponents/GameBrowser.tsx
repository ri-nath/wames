import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { User } from '../../../../types';

import AnagramStore from 'state/AnagramStore';
import RootNavigator from 'state/RootNavigator';
import Anagram  from 'lib/Anagram';
import {WamesListener} from 'lib/WamesEmitter';

type Props = {
    style: any,
    reduced?: boolean
}

type State = {
    games: Anagram[]
}

export default class GameBrowser extends Component<Props, State> {
    private listener: WamesListener | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            games: []
        };

        this.handleUpdateGamesList = this.handleUpdateGamesList.bind(this);
    }

    componentDidMount() {
        this.handleUpdateGamesList(AnagramStore.getGamesList());

        this.listener = AnagramStore.onUpdateGamesList(this.handleUpdateGamesList);
    }

    componentWillUnmount(): void {
        if (this.listener) this.listener.off();
    }

    handleUpdateGamesList(games: Anagram[]) {
        if (this.props.reduced) {
            this.setState({
                games: games.filter(game => !game.hasBeenViewed() || game.getLocalState().stage === 'NOT-STARTED')
            });
        } else {
            this.setState({
                games: games
            });
        }
    }

    render() {
        return (
            <View style={styles.view_games}>
                <Text style={styles.title}> { this.props.reduced ? 'Unopened Games' : 'All Games' } </Text>
                <FlatList
                    style={styles.list}
                    data={this.state.games.reverse()}
                    extraData={this.state}
                    keyExtractor={(item) => item.getID()}
                    renderItem={({item}) =>
                        <View style={styles.game_row}>
                            <TouchableOpacity
                                style={ [styles.button, { backgroundColor: item.getLocalState().stage === 'NOT-STARTED' ? 'lime' : 'gray'} ] }
                                onPress={ () => { RootNavigator.navigateToAnagramInfo(item) } }
                            >
                                <Text style={styles.button_text}>
                                    {
                                        item.getPlayers().map((user: User, iidx: number) => user.username + (item.getPlayers().length - 1 !== iidx ? ' vs. ' : ' ')
                                        )
                                    }
                                </Text>
                            </TouchableOpacity>
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
        borderRadius: 5,
    },

    button_text: {
        padding: 5
    },

    list: {
        flexGrow: 0,
        height: height * 0.4
    }
});


