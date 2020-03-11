import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import CharacterContainer from './CharacterContainer';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LENGTH = 8;



export default class Game extends Component {
    constructor(props) {
        super(props);

        let letters = Math.random().toString(36).substring(7).split('');

        for (let i = 0; i < LENGTH; i++ ) {
            letters[i] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)).toString();
        }

        this.state = {
            word: letters.map(_ => "!"),
            letters: letters,
        };

        this.handleAddLetter = this.handleAddLetter.bind(this);
        this.handleRemoveLetter = this.handleRemoveLetter.bind(this);
    }

    handleAddLetter(letter) {
        let word = this.state.word;

        word[word.indexOf("!")] = letter;

        let letters = this.state.letters;
        const index = letters.indexOf(letter);
        if (index > -1) {
            letters[index] = "!" + letter;
        }

        this.setState({
            word: word,
            letters: letters
        });

        if (!this.state.word.some(letter => letter.includes("!"))) {
            this.resetLetterLists();
        }
    }

    handleRemoveLetter(letter) {
        let letters = this.state.letters;

        letters[letters.indexOf("!" + letter)] = letter;

        let word = this.state.word;
        const index = word.indexOf(letter);
        if (index > -1) {
            word.splice(index, 1);
            word.push("!");
        }

        this.setState({
            word: word,
            letters: letters
        })
    }

    resetLetterLists() {
        const letters = this.state.letters.map(letter => letter.replace('!',''));
        const word = this.state.word.map(_ => '!');

        this.setState({
            letters: letters,
            word: word
        })
    }

    render() {
        return (
            <View>
                <View flexDirection='row' justifyContent='flex-start'>
                    {
                        this.state.letters.map((letter, idx) =>
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
                        this.state.word.map((letter, idx) =>
                            <CharacterContainer
                                key={ idx + this.state.letters.length }
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