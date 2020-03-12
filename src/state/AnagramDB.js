import * as Constants from "../constants";

import SuperStore from './SuperStore';
import AnagramStore from './AnagramStore';

/*
 * Game Object:
 * {
 *   letters: ["E", "T", "C"... ],
 *   time: 30 (Seconds)
 *   score: 0 (Points)
 *   words: ["lorem", "ipsum"...]
 * }
 *
 */

class GameDB {
    constructor() {
        SuperStore.onStartAnagramGame(letters => {
            this.initNewGame(letters);
            AnagramStore.startNewGame(letters);

            console.log(letters);
        });

        AnagramStore.onScoreWord(word => {
            this.addWord(word);
        });

        this.words = [];
        this.letters = [];
        this.score = 0;
    }

    initNewGame(letters) {
        this.words = [];
        this.letters = letters;
        this.score = 0;
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