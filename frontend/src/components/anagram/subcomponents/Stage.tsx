import { getConfig, isResolved, lazyGetState } from 'api';
import * as PConstants from 'constants';
import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { scoreWordOnActiveAnagramGame } from 'store/actions';
import { AnagramObject, State } from 'ts';

import Tile from './Tile';

type CState = {
    options: string[],
    picks: string[],
    on_word: boolean,
}

class Stage extends Component<any, CState> {
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
    }

    setLettersFromProps() {
        const options = this.props.letters.map((letter: string, idx: number) => letter + idx);

        this.setState({
            options: options,
            picks: options.map(() => PConstants.DESELECTOR),
            on_word: false
        });
    }

    componentDidMount() {
        this.setLettersFromProps();
    }

    handleScoreWord() {
        const current_word: string = this.state.picks.map(
            element => PConstants.ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        this.props.dispatch(scoreWordOnActiveAnagramGame(current_word));

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
            picks[picks.indexOf(PConstants.DESELECTOR)] = tile;
            options[options.indexOf(tile)] = PConstants.DESELECTOR + tile;
        } else {
            options[options.indexOf(PConstants.DESELECTOR + tile)] = tile;

            picks.splice(picks.indexOf(tile), 1);
            picks.push(PConstants.DESELECTOR);
        }

        let current_word: string = this.state.picks.map(
            element => PConstants.ALPHABET.split('').find(
                letter => element.includes(letter)
            )).join('').toLowerCase();

        const words: string[] = this.props.words;

        this.setState({
            picks: picks,
            options: options,
            on_word: !words.includes(current_word) && PConstants.WORDS.includes(current_word)
        });
    }

    resetTiles() {
        const options = this.state.options.map(letter => letter.replace(PConstants.DESELECTOR, ''));
        const picks = this.state.picks.map(_ => PConstants.DESELECTOR);

        this.setState({
            options: options,
            picks: picks,
            on_word: false
        });
    }

    render() {
        return (
            <Fragment>
                <View style={ styles.letters_area }>
                    <View style={ styles.options_row }>
                        {
                            this.state.options.map((letter: string, idx: number) =>
                                <Tile
                                    key={ idx }
                                    name={ letter }
                                    onPress={ () => {
                                        this.handleAddTile(letter);
                                    } }
                                />
                            )
                        }
                    </View>
                    <View style={ styles.picks_row }>
                        {
                            this.state.picks.map((letter: string, idx: number) =>
                                <Tile
                                    key={ idx + this.state.options.length }
                                    name={ letter }
                                    onPress={ () => {
                                        this.handleRemoveTile(letter);
                                    } }
                                />
                            )
                        }
                    </View>
                </View>
                <View style={ styles.score }>
                    <TouchableOpacity
                        disabled={ !this.state.on_word }
                        style={
                            [styles.score_button, { backgroundColor: this.state.on_word ? '#AD7A99' : '#6F4E62' }] }
                        onPress={ () => this.handleScoreWord() }
                    >
                        <Text style={ styles.score_button_text }>{
                            this.state.picks.map(
                                element => PConstants.ALPHABET.split('').find(
                                    letter => element.includes(letter)
                                )).join('').toUpperCase()
                        }</Text>
                    </TouchableOpacity>
                </View>
            </Fragment>
        );
    }
}

function mapStateToProps(state: State) {
    if (isResolved(state.anagram.active_game)) {
        return {
            letters: getConfig(state.anagram.active_game as unknown as AnagramObject).letters,
            words: lazyGetState(state.anagram.active_game as unknown as AnagramObject).words
        };
    } else {
        return {
            letters: [],
            words: []
        };
    }
}

export default connect(mapStateToProps)(Stage);

const styles = StyleSheet.create({
    letters_area: {
        flex: 1
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
        alignSelf: 'stretch'
    },

    score_button: {
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        flex: 1,

        margin: 10,
        borderRadius: 20
    },

    score_button_text: {
        fontSize: 75,
        color: 'white'
    }
});