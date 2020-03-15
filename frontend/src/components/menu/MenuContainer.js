import React, { Component, Fragment } from 'react';
import { StyleSheet, Button, View, TextInput, Text, TouchableOpacity } from 'react-native';

import SuperStore from '../../state/SuperStore';
import AnagramStore from '../../state/AnagramStore';

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <Fragment>
                <View styles={styles.create_game}>
                    <TextInput
                        placeholder='Opponent Username'
                        value={this.state.value}
                        onChangeText={this.handleChange}
                    />
                    <Button
                        title='Create Game'
                        />
                </View>
                <View styles={styles.view_games}>
                    {
                        AnagramStore.game_instances.map((game_instance, idx) =>
                            <View key={idx} flexDirection='row'>
                                    {
                                        Object.keys(game_instance.states).map((user_id, iidx) =>
                                           <Text key={AnagramStore.game_instances.length + iidx}>
                                               { user_id + (Object.keys(game_instance.states).length - 1 !== iidx ? ', ' : ' ')}
                                           </Text>
                                        )
                                    }
                                    <TouchableOpacity
                                        style={ styles.button }
                                        disabled={ game_instance.getLocalState().stage !== 'not-started' }
                                        onPress={ _ => {SuperStore.stateToAnagramGame(game_instance)} }
                                    >
                                        <Text>{game_instance.getLocalState().stage}</Text>
                                    </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    create_game: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    view_games: {
        flex: 2,
    },

    button: {
        backgroundColor: '#DDDDDD',
    }
});