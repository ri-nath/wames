import React, { Component } from 'react';
import { View } from 'react-native';

import Tile from './Tile';

import AnagramStore from '../../../state/AnagramStore';
import * as Constants from '../../../constants';
import Anagram from '../../../state/wrappers/Anagram';

type State = {
    options: string[],
    picks: string[]
}

export default class Stage extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            options: [],
            picks: []
        };

        this.handleAddTile = this.handleAddTile.bind(this);
        this.handleRemoveTile = this.handleRemoveTile.bind(this);
        this.resetTiles = this.resetTiles.bind(this);

        this.setLettersFromGameInstance = this.setLettersFromGameInstance.bind(this);
    }

    componentDidMount() {
        const game_obj = AnagramStore.active_game;
        this.setLettersFromGameInstance(game_obj);

        AnagramStore.onStartNewGame((game_obj: Anagram) => {
            this.setLettersFromGameInstance(game_obj)
        });
    }

    setLettersFromGameInstance(game_obj: Anagram) {
        const options = game_obj.getConfig().letters.map((letter, idx) => letter + idx);

        this.setState({
            options: options,
            picks: options.map(_ => Constants.DESELECTOR),
        });
    }

    handleAddTile(value: string) {
        let picks = this.state.picks;
        picks[picks.indexOf(Constants.DESELECTOR)] = value;

        let options = this.state.options;
        options[options.indexOf(value)] = Constants.DESELECTOR + value;

        this.setState({
            picks: picks,
            options: options
        });

        let current_word: string = this.state.picks.map(
            element => Constants.ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        const words: string[] = AnagramStore.active_game.getLocalState().words;

        if (!words.includes(current_word) && Constants.WORDS.includes(current_word)) {
            AnagramStore.scoreWord(current_word);
            this.resetTiles();
        }

        if (!this.state.picks.some(letter => letter.includes(Constants.DESELECTOR))) {
            this.resetTiles();
        }
    }

    handleRemoveTile(tile: string) {
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

    resetTiles() {
        const options = this.state.options.map(letter => letter.replace(Constants.DESELECTOR,''));
        const picks = this.state.picks.map(_ => Constants.DESELECTOR);

        this.setState({
            options: options,
            picks: picks
        });
    }

    render() {
        return (
            <View>
                <View flexDirection='row' justifyContent='flex-start'>
                    {
                        this.state.options.map((letter: string, idx: number) =>
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
                        this.state.picks.map((letter: string, idx: number) =>
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