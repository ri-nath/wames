import { getDateString, getLink, getPlayers, getState, isResolved, lazyDependOnVow, lazyGetState } from 'api';
import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Clipboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { markGameAsViewed, startAnagramGameCycle } from 'store/actions';
import { AnagramObject, State, User, Vow } from 'ts';

type Props = {
    game: Vow<AnagramObject>,
    dispatch: Function,
}

class GamePortal extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        if (isResolved(this.props.game)) this.props.dispatch(markGameAsViewed(this.props.game as unknown as AnagramObject));
    }

    render() {
        return (
            lazyDependOnVow<AnagramObject>(this.props.game,
                () => <ActivityIndicator size='large'/>,
                (err) => <Text> { err.toString() }</Text>,
                (game: AnagramObject) =>
                    <View style={ styles.container }>
                        <Text>{ getDateString(game) } </Text>
                        <Text> Anagram Game </Text>
                        <Button
                            type='clear'
                            icon={
                                <Icon name="link"/>
                            }
                            onPress={ () => Clipboard.setString(getLink(game)) }/>
                        {
                            lazyGetState(game).stage === 'NOT-STARTED' ?
                                <Fragment>
                                    <View style={ { flex: 1, justifyContent: 'flex-start' } }>
                                        <Text style={ styles.name }>
                                            {
                                                getPlayers(game).map((user: User, idx: number) =>
                                                    user.username + (getPlayers(game).length - 1 !== idx ? ' vs. ' : ' ')
                                                )
                                            }
                                        </Text>
                                    </View>
                                    <View style={ { flex: 3, justifyContent: 'center' } }>
                                        <TouchableOpacity
                                            style={ styles.play_button }
                                            onPress={ () => this.props.dispatch(startAnagramGameCycle(game)) }>
                                            <Text style={ styles.play_button_text }>Play</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Fragment>
                                :
                                <View style={ styles.user_cols }>
                                    {
                                        getPlayers(game).map((user: User, idx: number) => {
                                            const state = getState(game, user);

                                            if (state.stage === 'NOT-STARTED') {
                                                return (
                                                    <View
                                                        key={ idx }
                                                        style={ styles.user_data }>
                                                        <Text style={ styles.name }> { user.username }</Text>
                                                        <Text> Challenge sent... </Text>
                                                    </View>
                                                );
                                            } else if (state.stage === 'FINISHED') {
                                                return (
                                                    <View
                                                        key={ idx }
                                                        style={ styles.user_data }>
                                                        <Text style={ styles.name }> { user.username }</Text>
                                                        <Text style={ styles.score }> { state.score }</Text>
                                                        {
                                                            state.words.map((word, iidx) =>
                                                                <Text key={ iidx }> { word.toUpperCase() } </Text>
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
        );
    }
}

function mapStateToProps(state: State) {
    return {
        game: state.menu.portal_game
    };
}

// @ts-ignore
export default connect(mapStateToProps)(GamePortal);

const styles = StyleSheet.create({
    user_cols: {
        flex: 1,
        flexDirection: 'row'
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    play_button: {
        backgroundColor: 'lime',
        borderRadius: 10,
        margin: 0
    },

    play_button_text: {
        padding: 30,
        fontSize: 80
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
        fontSize: 25
    },

    score: {
        fontSize: 50
    }
});
