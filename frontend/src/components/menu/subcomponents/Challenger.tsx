import React, { Component } from 'react';
import {StyleSheet, View, TextInput, Button} from 'react-native';
import { Text } from 'react-native-elements';

import { AnagramObject } from '../../../../types';

import ServerStore from 'server/ServerStore';
import RootNavigator from 'state/RootNavigator';
import LinkHandler from 'state/LinkHandler'

import Anagram from 'lib/Anagram';
import AnagramStore from 'state/AnagramStore';

type State = {
    value: string
}

export default class Challenger extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    handleChangeValue(value: string) {
        this.setState({
            value: value
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text h4> Play Anagrams </Text>
                <View style={styles.create_game}>
                    <View style={styles.left_box}>
                        <Text style={styles.small_header}> Challenge a User </Text>
                        <TextInput
                            placeholder='Opponent Username'
                            value={this.state.value}
                            onChangeText={this.handleChangeValue}
                        />
                        <Button
                            disabled={this.state.value.length < 1}
                            title='Challenge User'
                            onPress={() => ServerStore.createGame([this.state.value], (game: AnagramObject) => {
                                // TODO: Improve logic
                                const wrapped = new Anagram(game, ServerStore.getUserID());

                                AnagramStore.processLoadGame(wrapped, false);
                                RootNavigator.navigateToAnagramInfo(wrapped);
                            })}
                        />
                    </View>
                    <View style={styles.right_box}>
                        <Text style={styles.small_header}> Create a Link </Text>
                        <Button title='Test' onPress={() => ServerStore.createGame([], (game: AnagramObject) => {
                            // TODO: Improve logic
                            const wrapped = new Anagram(game, ServerStore.getUserID());

                            AnagramStore.processLoadGame(wrapped, false);
                            RootNavigator.navigateToAnagramInfo(wrapped);

                            console.log("Hello");
                            console.log(LinkHandler.createGameURL(wrapped))
                        })}/>
                    </View>
                </View>



            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    create_game: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    left_box: {
        borderRightColor: 'gray',
        borderRightWidth: StyleSheet.hairlineWidth,

        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    right_box: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    small_header: {
        fontSize: 15,
        margin: 20,
    }
});


