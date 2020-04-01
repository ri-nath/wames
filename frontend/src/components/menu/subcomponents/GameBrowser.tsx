import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { User } from '../../../../types';

import AnagramStore from 'state/AnagramStore';
import RootNavigator from 'state/RootNavigator';
import Anagram  from 'lib/Anagram';
import {WamesListener} from 'lib/WamesEmitter';
import {Badge, Icon, ListItem, Text} from 'react-native-elements';
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
                <View style={styles.list_title}>
                    <Text h4>{ this.props.reduced ? 'Unopened Games' : 'All Games'}</Text>
                </View>
                <View style={styles.list}>
                    <FlatList
                        contentContainerStyle={styles.list_container}
                        data={this.state.games}
                        extraData={this.state}
                        keyExtractor={(item) => item.getID()}
                        renderItem={({item}) => {
                            const finished = item.getLocalState().stage === 'FINISHED';
                            const highlighted = !finished || !item.hasBeenViewed();
                            const allPlayersFinished = item.getPlayers().filter(player => item.getState(player.user_id).stage === 'NOT-STARTED').length === 0;

                            return (
                                <ListItem
                                    containerStyle={{backgroundColor: highlighted ? 'white' : '#ededed'}}
                                    onPress={ () => { RootNavigator.navigateToAnagramInfo(item) } }
                                    title={
                                        item.getPlayers().map((user: User, iidx: number) =>
                                            user.username + (item.getPlayers().length - 1 !== iidx ? ' vs. ' : ' ')
                                        ).join('')
                                    }
                                    bottomDivider
                                    chevron
                                    subtitle={
                                        <Fragment>
                                            <Text>Anagram Game</Text>
                                            <Text>{ item.getDateString() }</Text>
                                        </Fragment>
                                    }
                                    badge={{
                                        status:
                                            !finished
                                                ? 'success'
                                                : item.hasBeenViewed()
                                                    ? allPlayersFinished
                                                        ?  'success'
                                                        :  'warning'
                                                    : 'primary',
                                        value:
                                            !finished ?
                                                'Play Game'
                                                : item.hasBeenViewed() ?
                                                    allPlayersFinished ?
                                                    undefined
                                                    :  'Challenge Sent...'
                                                : 'New Results!',
                                    }}
                                />
                            )
                        }

                        }
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    view_games: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },

    list: {
        alignSelf: 'stretch',
        flex: 5,
    },

    list_container: {
        borderTopColor: 'gray',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexGrow: 1,
    },

    list_title: {
        flex: 1,
    }
});


