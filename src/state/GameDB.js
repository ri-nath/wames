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

        for (let i = 0; i < Constants.TILES; i++) {
            this.letters[i] = Constants.WEIGHTED_LETTERS[(Math.floor(Math.random() * Constants.WEIGHTED_LETTERS.length))];
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