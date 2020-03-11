import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import CharacterContainer from './CharacterContainer';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LENGTH = 8;

export const NON = '!';

export default class Game extends Component {
    constructor(props) {
        super(props);

        let letters = [];

        for (let i = 0; i < LENGTH; i++ ) {
            letters[i] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)).toString();
        }

        const options = letters.map((letter, idx) => letter + idx);

        this.state = {
            picks: options.map(_ => NON),
            options: options,
        };

        this.handleAddLetter = this.handleAddLetter.bind(this);
        this.handleRemoveLetter = this.handleRemoveLetter.bind(this);
    }

    handleAddLetter(letter) {
        let picks = this.state.picks;
        picks[picks.indexOf(NON)] = letter;

        let options = this.state.options;
        options[options.indexOf(letter)] = NON + letter;

        this.setState({
            picks: picks,
            options: options
        });

        if (!this.state.picks.some(letter => letter.includes(NON))) {
            this.resetLetterLists();
        }
    }

    handleRemoveLetter(letter) {
        let options = this.state.options;
        options[options.indexOf(NON + letter)] = letter;

        let picks = this.state.picks;
        picks.splice(picks.indexOf(letter), 1);
        picks.push(NON);

        this.setState({
            picks: picks,
            options: options
        })
    }

    resetLetterLists() {
        const options = this.state.options.map(letter => letter.replace(NON,''));
        const picks = this.state.picks.map(_ => NON);

        this.setState({
            options: options,
            picks: picks
        })
    }

    render() {
        return (
            <View>
                <View flexDirection='row' justifyContent='flex-start'>
                    {
                        this.state.options.map((letter, idx) =>
                            <CharacterContainer
                                key={ idx }
                                name={ letter }
                                onPress= { _ => {this.handleAddLetter(letter)} }
                            />
                        )
                    }
                </View>
                <View flexDirection='row'>
                    {
                        this.state.picks.map((letter, idx) =>
                            <CharacterContainer
                                key={ idx + this.state.options.length }
                                name={ letter }
                                onPress= { _ => {this.handleRemoveLetter(letter)} }
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}