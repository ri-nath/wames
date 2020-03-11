import React, { Component } from 'react';
import { View } from 'react-native';
import Words from 'an-array-of-english-words';

import CharacterContainer from './CharacterContainer';

import GameStore from '../state/GameStore';

const WORDS = Words.filter(word => word.length > 2);

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VOWELS = 'AEIOU';
const LENGTH = 8;
const MIN_VOWELS = LENGTH / 4;

export const NON = '!';

export default class Stage extends Component {
    constructor(props) {
        super(props);

        let letters = [];

        for (let i = 0; i < MIN_VOWELS; i++ ) {
            letters[i] = VOWELS.charAt(Math.floor(Math.random() * VOWELS.length)).toString();
        }

        for (let i = MIN_VOWELS; i < LENGTH; i++ ) {
            letters[i] = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length)).toString();
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

        let current_word = this.state.picks.map(
            element => ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        if (WORDS.includes(current_word)) {
            this.resetLetterLists(current_word.length * 10);
        }

        if (!this.state.picks.some(letter => letter.includes(NON))) {
            this.resetLetterLists(0);
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

    resetLetterLists(points) {
        const options = this.state.options.map(letter => letter.replace(NON,''));
        const picks = this.state.picks.map(_ => NON);

        this.setState({
            options: options,
            picks: picks
        });

        GameStore.addPoints(points);
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