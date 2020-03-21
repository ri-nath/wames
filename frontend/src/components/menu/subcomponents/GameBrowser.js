import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import AnagramStore from '../../../state/AnagramStore';
import SuperStore from "../../../state/SuperStore";

export default class GameBrowser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            games: []
        }
    }

    componentDidMount() {
        this.setState({
            games: AnagramStore.game_instances
        });

        AnagramStore.onUpdateGamesList(_ => {
            this.setState({
                games: AnagramStore.game_instances
            });
        })
    }

    render() {
        return (
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
        )
    }
}

const styles = StyleSheet.create({
    view_games: {
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
});


