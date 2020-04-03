import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { connect } from 'react-redux';

import { AnagramObject, User } from '../../../../types';
import {getDateString, getLink, getPlayers, getState, lazyGetState} from 'util/Anagram';
import {markGameAsViewed, startAnagramGameCycle} from 'store/actions';
import {Nullable, State} from 'store/types';
import { isResolved } from 'util/Vow';
import {Button, Icon} from 'react-native-elements';

type Props = {
    game: AnagramObject,
    dispatch: any,
}

class GamePortal extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        if (isResolved(this.props.game)) this.props.dispatch(markGameAsViewed(this.props.game));
    }

    render() {
        if (this.props.game) {
            return (
                <View style={styles.container}>
                    <Text>{ getDateString(this.props.game) } </Text>
                    <Text> Anagram Game </Text>
                    <Button
                        type='clear'
                        icon={
                            <Icon name="link"/>
                        }
                        onPress={() => Clipboard.setString(getLink(this.props.game))}/>
                    {
                        lazyGetState(this.props.game).stage === 'NOT-STARTED' ?
                            <Fragment>
                                <View style={{flex: 1, justifyContent: "flex-start"}}>
                                    <Text style={styles.name}>
                                        {
                                            getPlayers(this.props.game).map((user: User, idx: number) =>
                                                user.username + (getPlayers(this.props.game).length - 1 !== idx ? ' vs. ' : ' ')
                                            )
                                        }
                                    </Text>
                                </View>
                                <View style={{flex: 3, justifyContent: "center"}}>
                                    <TouchableOpacity
                                        style={styles.play_button}
                                        onPress={() => this.props.dispatch(startAnagramGameCycle(this.props.game))}>
                                        <Text style={styles.play_button_text}>Play</Text>
                                    </TouchableOpacity>
                                </View>
                            </Fragment>
                            :
                            <View style={styles.user_cols}>
                                {
                                    getPlayers(this.props.game).map((user: User, idx: number) => {
                                        const state = getState(this.props.game, user);

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
        } else {
            return (
                <View style={styles.container}>
                    <Text>Error! Game is undefined!</Text>
                </View>
            )
        }
    }
}

function mapStateToProps(state: State) {
    return {
        game: isResolved(state.menu.portal_game) ? state.menu.portal_game : undefined,
    }
}

// @ts-ignore
export default connect(mapStateToProps)(GamePortal)

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
