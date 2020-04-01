import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { User } from '../../../../types';

import AnagramStore from 'state/AnagramStore';
import RootNavigator from 'state/RootNavigator';
import Anagram  from 'lib/Anagram';
import {WamesListener} from 'lib/WamesEmitter';
import {Badge, Icon} from 'react-native-elements';
import SuperStore from 'state/SuperStore';
import ServerStore from 'server/ServerStore';

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
                    contentContainerStyle={styles.list_container}
                    data={this.state.games.reverse()}
                    extraData={this.state}
                    keyExtractor={(item) => item.getID()}
                    renderItem={({item}) =>
                        <TouchableOpacity
                            style={styles.game_row}
                            onPress={ () => { RootNavigator.navigateToAnagramInfo(item) } }
                        >
                            <View style={styles.game_row_col}>
                                <Text style={styles.playernames}>
                                    {
                                        item.getPlayers().map((user: User, iidx: number) =>
                                            user.username + (item.getPlayers().length - 1 !== iidx ? ' vs. ' : ' ')
                                        )
                                    }
                                </Text>
                                <Text>Anagram Game</Text>
                                <Text>{ item.getDateString() }</Text>
                            </View>
                            <View style={styles.game_row_col}>
                                {
                                    item.getLocalState().stage === 'FINISHED' ?
                                        item.getPlayers().filter(user => user.user_id !== ServerStore.getUserID()).map((user: User, iidx: number) => {
                                            const finished: boolean = item.getState(user.user_id).stage === 'FINISHED';
                                            return (
                                                <View
                                                    key={iidx}
                                                    style={styles.game_row_user_status}>
                                                    <Text>{ user.username + ' ' }</Text>
                                                    <Badge
                                                        status={ finished ? 'success' : 'warning' }
                                                        value={
                                                            <Text>
                                                                {
                                                                    finished ? 'Finished' : 'Waiting...'
                                                                }
                                                            </Text>
                                                        }/>
                                                </View>
                                            )

                                        })
                                        :
                                        <Text>Play!</Text>
                                }
                            </View>
                        </TouchableOpacity>
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
        flex: 1,
    },

    game_row: {
        flex: 1,
        padding: 5,
        borderBottomColor: 'gray',
        borderBottomWidth: StyleSheet.hairlineWidth,

        flexDirection: 'row',
    },

    game_row_col: {
        flexDirection: 'column',
    },

    game_row_user_status: {
        flex: 1,
        flexDirection: 'row',
    },

    title: {
        flex: 1,
        marginBottom: 10,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    playernames: {
        fontSize: 20
    },

    list: {
        alignSelf: 'stretch',
    },

    list_container: {
        borderTopColor: 'gray',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexGrow: 1,
    }
});


