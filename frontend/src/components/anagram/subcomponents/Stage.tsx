import React, { Component, Fragment } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import Tile from './Tile';

import AnagramStore from '../../../state/AnagramStore';
import * as Constants from '../../../constants';
import Anagram from '../../../state/wrappers/Anagram';

type State = {
    options: string[],
    picks: string[],
    on_word: boolean,
}

export default class Stage extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            options: [],
            picks: [],
            on_word: false
        };

        this.handleAddTile = this.handleAddTile.bind(this);
        this.handleChangeTile = this.handleChangeTile.bind(this);
        this.handleRemoveTile = this.handleRemoveTile.bind(this);
        this.resetTiles = this.resetTiles.bind(this);
        this.handleScoreWord = this.handleScoreWord.bind(this);

        this.setLettersFromGameInstance = this.setLettersFromGameInstance.bind(this);
    }

    componentDidMount() {
        const game_obj: Anagram = AnagramStore.getActiveGame();
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

    handleScoreWord() {
        const current_word: string = this.state.picks.map(
            element => Constants.ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        AnagramStore.scoreWord(current_word);

        this.resetTiles();
    }

    handleAddTile(tile: string) {
        this.handleChangeTile(tile, true);
    }

    handleRemoveTile(tile: string) {
        this.handleChangeTile(tile, false);
    }

    handleChangeTile(tile: string, adding: boolean) {
        let options = this.state.options;
        let picks = this.state.picks;

        if (adding) {
            picks[picks.indexOf(Constants.DESELECTOR)] = tile;
            options[options.indexOf(tile)] = Constants.DESELECTOR + tile;
        } else {
            options[options.indexOf(Constants.DESELECTOR + tile)] = tile;

            picks.splice(picks.indexOf(tile), 1);
            picks.push(Constants.DESELECTOR);
        }

        let current_word: string = this.state.picks.map(
            element => Constants.ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        const words: string[] = AnagramStore.getActiveGame().getLocalState().words;

        this.setState({
            picks: picks,
            options: options,
            on_word: !words.includes(current_word) && Constants.WORDS.includes(current_word)
        });
    }

    resetTiles() {
        const options = this.state.options.map(letter => letter.replace(Constants.DESELECTOR,''));
        const picks = this.state.picks.map(_ => Constants.DESELECTOR);

        this.setState({
            options: options,
            picks: picks,
            on_word: false
        });
    }

    render() {
        return (
            <Fragment>
                <View style={styles.letters_area}>
                    <View style={styles.options_row}>
                        {
                            this.state.options.map((letter: string, idx: number) =>
                                <Tile
                                    key={ idx }
                                    name={ letter }
                                    onPress= { () => {this.handleAddTile(letter)} }
                                />
                            )
                        }
                    </View>
                    <View style={styles.picks_row}>
                        {
                            this.state.picks.map((letter: string, idx: number) =>
                                <Tile
                                    key={ idx + this.state.options.length }
                                    name={ letter }
                                    onPress= { () => {this.handleRemoveTile(letter)} }
                                />
                            )
                        }
                    </View>
                </View>
                <View style={styles.score}>
                    <TouchableOpacity
                        disabled={!this.state.on_word}
                        style={
                            [styles.score_button, {backgroundColor: this.state.on_word ? '#AD7A99' : '#6F4E62'}]}
                        onPress={() => this.handleScoreWord()}
                    >
                        <Text style={styles.score_button_text}>{
                            this.state.picks.map(
                                element => Constants.ALPHABET.split('').find(
                                    letter => element.includes(letter)
                                )).join('').toUpperCase()
                        }</Text>
                    </TouchableOpacity>
                </View>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    letters_area: {
        flex: 1,
    },

    options_row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    picks_row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    score: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },

    score_button: {
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        flex: 1,

        margin: 10,
        borderRadius: 20,
    },

    score_button_text: {
        fontSize: 75,
        color: 'white',
    }
});