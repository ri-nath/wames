import MicroEmitter from 'micro-emitter';
import * as Constants from "../constants";

class GameDB {
    constructor() {
        this.initNewGame();
    }

    initNewGame() {
        this.words = [];
        this.score = 0;
        this.letters = [];

        for (let i = 0; i < Constants.MIN_VOWELS; i++) {
            this.letters[i] = Constants.VOWELS.charAt(Math.floor(Math.random() * Constants.VOWELS.length)).toString();
        }

        for (let i = Constants.MIN_VOWELS; i < Constants.TILES; i++) {
            this.letters[i] = Constants.ALPHABET.charAt(Math.floor(Math.random() * Constants.ALPHABET.length)).toString();
        }
    }

    getLetters() {
        return this.letters;
    }

    getScore() {
        return this.score;
    }

    addWord(word) {
        this.words.push(word);

        this.score += 10 * word.length;
    }

    isWordScored(word) {
        return this.words.includes(word);
    }

    getWords() {
        return this.words;
    }
}

export default new GameDB();