import React, { Component } from 'react';
import { View } from 'react-native';

import Tile from './Tile';

import GameStore from '../../../state/GameStore';
import * as Constants from '../../../constants';

export default class Stage extends Component {
    constructor(props) {
        super(props);

        let letters = [];

        for (let i = 0; i < Constants.MIN_VOWELS; i++ ) {
            letters[i] = Constants.VOWELS.charAt(Math.floor(Math.random() * Constants.VOWELS.length)).toString();
        }

        for (let i = Constants.MIN_VOWELS; i < Constants.TILES; i++ ) {
            letters[i] = Constants.ALPHABET.charAt(Math.floor(Math.random() * Constants.ALPHABET.length)).toString();
        }

        const options = letters.map((letter, idx) => letter + idx);

        this.state = {
            picks: options.map(_ => Constants.DESELECTOR),
            options: options,
            words: [],
        };

        this.handleAddTile = this.handleAddTile.bind(this);
        this.handleRemoveTile = this.handleRemoveTile.bind(this);
    }

    handleAddTile(value) {
        let picks = this.state.picks;
        picks[picks.indexOf(Constants.DESELECTOR)] = value;

        let options = this.state.options;
        options[options.indexOf(value)] = Constants.DESELECTOR + value;

        this.setState({
            picks: picks,
            options: options
        });

        let current_word = this.state.picks.map(
            element => Constants.ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        if (!this.state.words.includes(current_word) && Constants.WORDS.includes(current_word)) {
            this.state.words.push(current_word);
            this.resetTiles(current_word.length * 10);
        }

        if (!this.state.picks.some(letter => letter.includes(Constants.DESELECTOR))) {
            this.resetTiles(0);
        }
    }

    handleRemoveTile(tile) {
        let options = this.state.options;
        options[options.indexOf(Constants.DESELECTOR + tile)] = tile;

        let picks = this.state.picks;
        picks.splice(picks.indexOf(tile), 1);
        picks.push(Constants.DESELECTOR);

        this.setState({
            picks: picks,
            options: options
        })
    }

    resetTiles(points) {
        const options = this.state.options.map(letter => letter.replace(Constants.DESELECTOR,''));
        const picks = this.state.picks.map(_ => Constants.DESELECTOR);

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
                            <Tile
                                key={ idx }
                                name={ letter }
                                onPress= { _ => {this.handleAddTile(letter)} }
                            />
                        )
                    }
                </View>
                <View flexDirection='row'>
                    {
                        this.state.picks.map((letter, idx) =>
                            <Tile
                                key={ idx + this.state.options.length }
                                name={ letter }
                                onPress= { _ => {this.handleRemoveTile(letter)} }
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}