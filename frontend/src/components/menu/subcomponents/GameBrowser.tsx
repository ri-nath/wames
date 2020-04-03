import React, { Component, Fragment } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import {AnagramObject, User} from '../../../../types';

import RootNavigator from 'lib/RootNavigator';
import {Badge, Icon, ListItem, Text} from 'react-native-elements';
import {getDateString, getID, getPlayers, getState, lazyGetState, lazyGetViewed} from 'util/Anagram';
import {openGamePortal} from 'store/actions';
import {State} from 'store/types';
import {connect} from 'react-redux';
import {isResolved} from 'util/Vow';

type Props = {
    style: any,
    games: AnagramObject[],
    dispatch: any,
    reduced?: boolean
}

class GameBrowser extends Component<Props, any> {
    handleUpdateGamesList(games: AnagramObject[]) {
        if (this.props.reduced) {
            this.setState({
                games: games.filter(game => lazyGetViewed(game) || lazyGetState(game).stage === 'NOT-STARTED')
            });
        } else {
            this.setState({
                games: games
            });
        }
    }

    render() {
        let games;

        if (this.props.reduced) {
            games = this.props.games.filter(game => lazyGetViewed(game) || lazyGetState(game).stage === 'NOT-STARTED')
        } else {
            games = this.props.games;
        }

        return (
            <View style={styles.view_games}>
                <View style={styles.list_title}>
                    <Text h4>{ this.props.reduced ? 'Unopened Games' : 'All Games'}</Text>
                </View>
                <View style={styles.list}>
                    <FlatList
                        contentContainerStyle={styles.list_container}
                        data={games}
                        extraData={this.props}
                        keyExtractor={(item) => getID(item)}
                        renderItem={({item}) => {
                            const finished = lazyGetState(item).stage === 'FINISHED';
                            const highlighted = !finished || !lazyGetViewed(item);
                            const allPlayersFinished = getPlayers(item).filter(player => getState(item, player).stage === 'NOT-STARTED').length === 0;

                            return (
                                <ListItem
                                    containerStyle={{backgroundColor: highlighted ? 'white' : '#ededed'}}
                                    onPress={ () => { this.props.dispatch(openGamePortal(item)) } }
                                    title={
                                        getPlayers(item).map((user: User, iidx: number) =>
                                            user.username + (getPlayers(item).length - 1 !== iidx ? ' vs. ' : ' ')
                                        ).join('')
                                    }
                                    bottomDivider
                                    chevron
                                    subtitle={
                                        <Fragment>
                                            <Text>Anagram Game</Text>
                                            <Text>{ getDateString(item) }</Text>
                                        </Fragment>
                                    }
                                    badge={{
                                        status:
                                            !finished
                                                ? 'success'
                                                : lazyGetViewed(item)
                                                    ? allPlayersFinished
                                                        ?  'success'
                                                        :  'warning'
                                                    : 'primary',
                                        value:
                                            !finished ?
                                                'Play Game'
                                                : lazyGetViewed(item) ?
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

function mapStateToProps(state: State) {
    return {
        games: isResolved(state.data.anagram_games) ? state.data.anagram_games : []
    }
}

// @ts-ignore
export default connect(mapStateToProps)(GameBrowser)


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


