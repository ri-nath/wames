import React, { Component, Fragment } from 'react';
import { StyleSheet, Button, View, TextInput, Text, TouchableOpacity } from 'react-native';

import SuperStore from '../../state/SuperStore';
import AnagramStore from '../../state/AnagramStore';

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };

        this.handleChangeName = this.handleChangeName.bind(this);
    }

    componentDidMount() {
        AnagramStore.onUpdateGamesList(_ => {
            this.forceUpdate();
        })
    }

    handleChangeName(text) {
        this.setState({
            name: text
        });
    }

    render() {
        return (
            <Fragment>
                <View style={styles.create_game}>
                    <TextInput
                        placeholder='Opponent Username'
                        value={this.state.name}
                        onChangeText={this.handleChangeName}
                    />
                    <Button
                        title='Create Game'
                        onPress={_ => SuperStore.createAnagramGame(this.state.name)}
                        />
                </View>
                <View style={styles.view_games}>
                    <Text style={styles.title}> Games </Text>
                    {
                        AnagramStore.game_instances.map((game_instance, idx) =>
                            <View style={ styles.game_row } key={idx} flexDirection='row'>
                                {
                                    Object.keys(game_instance.states).map((user_id, iidx) =>
                                        <Text key={AnagramStore.game_instances.length + iidx}>
                                            {user_id + (Object.keys(game_instance.states).length - 1 !== iidx ? ', ' : ' ')}
                                        </Text>
                                    )
                                }
                                {
                                    game_instance.getLocalState().stage === 'finished' ?
                                        <TouchableOpacity
                                            style={ styles.button }
                                            onPress={ _ => {alert(Object.keys(game_instance.states).map(user_id =>
                                                user_id + ' vs ' + game_instance.states[user_id].score + ', with: ' + game_instance.states[user_id].words.join(' '),
                                            ).join('\n'))} }
                                        ><Text>View Results</Text></TouchableOpacity> :
                                        <TouchableOpacity
                                            style={ styles.button }
                                            disabled={ game_instance.getLocalState().stage !== 'not-started' }
                                            onPress={ _ => {SuperStore.stateToAnagramGame(game_instance)} }
                                        >
                                            <Text>{ game_instance.getLocalState().stage }</Text>
                                        </TouchableOpacity>

                                }
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    view_games: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',

        marginVertical: 50,
    },

    game_row: {
        marginVertical: 5
    },

    title: {
        marginBottom: 10,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: '#DEC0F1',
        padding: 5,
        borderRadius: 10
    }
});