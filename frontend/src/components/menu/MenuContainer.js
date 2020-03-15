import React, { Component } from 'react';
import {StyleSheet, Button, View} from 'react-native';

import SuperStore from '../../state/SuperStore';

export default class MenuContainer extends Component {
    constructor(props) {
        super(props);

        this.temp_user_id = "CRAUEL";

        this.example_game_one = {
            "uuid": "fwu0e8gtabofubeg8g",
            "states": {
                [this.temp_user_id]: {
                    "words": ["dog", "cat", "mouse"],
                    "stage": "finished",
                    "score": 200
                },
                "kwargoly": {
                    "words": ["mouse"],
                    "stage": "finished",
                    "score": 70
                }
            },
            "config": {
                "letters": ["D", "O", "G", "C", "A", "T", "M", "O"],
                "duration": 30
            }
        };

        this.example_game_two = {
            "uuid": "jottoktokwoakdpskod",
            "states": {
                [this.temp_user_id]: {
                    "words": [],
                    "stage": "not-started",
                    "score": 0
                },
                "kwargoly": {
                    "words": [],
                    "stage": "not-started",
                    "score": 0
                }
            },
            "config": {
                "letters": ["O", "T", "T", "F", "F", "S", "S", "E"],
                "duration": 30
            }
        }
    }

    render() {
        return (
            <View>
                <Button title='play' onPress={_ => SuperStore.stateToAnagramGame(this.example_game_one)}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    info: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    stage: {
        flex: 2,
    }
});