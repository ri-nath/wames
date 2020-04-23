import { getDateString, getID, getPlayers, getState, lazyDependOnVow, lazyGetState, lazyGetViewed } from 'api';
import React, { Component, Fragment } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';

import { openGamePortal } from 'store/actions';
import { AnagramObject, State, User, Vow } from 'ts';

type Props = {
    style: any,
    games: Vow<AnagramObject[]>,
    dispatch: any,
    reduced?: boolean
}

class GameBrowser extends Component<Props, any> {

    render() {
        console.log('Yep!', this.props.games)

        return (
            <View style={ styles.view_games }>
                <View style={ styles.list_title }>
                    <Text h4>{ this.props.reduced ? 'Unopened Games' : 'All Games' }</Text>
                </View>
                <View style={ styles.list }>
                    {
                        lazyDependOnVow<AnagramObject[]>(this.props.games,
                            () => <ActivityIndicator size='large'/>,
                            (err) => <Text> { err.toString() }</Text>,
                            (games: AnagramObject[]) =>
                                <FlatList
                                contentContainerStyle={ styles.list_container }
                                data={ this.props.reduced ? games.filter(game => !lazyGetViewed(game) || lazyGetState(game).stage === 'NOT-STARTED') : games }
                                extraData={ this.props }
                                keyExtractor={ (item) => getID(item) }
                                renderItem={ ({ item }) => {
                                    const finished = lazyGetState(item).stage === 'FINISHED';
                                    const highlighted = !finished || !lazyGetViewed(item);
                                    const allPlayersFinished = getPlayers(item).filter(player => getState(item, player).stage === 'NOT-STARTED').length === 0;

                                    return (
                                        <ListItem
                                            containerStyle={ { backgroundColor: highlighted ? 'white' : '#ededed' } }
                                            onPress={ () => {
                                                this.props.dispatch(openGamePortal(item));
                                            } }
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
                                            badge={ {
                                                status:
                                                    !finished
                                                        ? 'success'
                                                        : lazyGetViewed(item)
                                                        ? allPlayersFinished
                                                            ? 'success'
                                                            : 'warning'
                                                        : 'primary',
                                                value:
                                                    !finished ?
                                                        'Play Game'
                                                        : lazyGetViewed(item) ?
                                                        allPlayersFinished ?
                                                            undefined
                                                            : 'Challenge Sent...'
                                                        : 'New Results!'
                                            } }
                                        />
                                    );
                                }

                                }
                            />
                        )
                    }
                </View>
            </View>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        games: state.data.anagram_games
    };
}

export default connect(mapStateToProps)(GameBrowser);


const styles = StyleSheet.create({
    view_games: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1
    },

    list: {
        alignSelf: 'stretch',
        flex: 5
    },

    list_container: {
        borderTopColor: 'gray',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexGrow: 1
    },

    list_title: {
        flex: 1
    }
});


