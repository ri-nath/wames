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
        SuperStore.onStartAnagramGame(game_obj => {
            this.initNewGame(game_obj);
            AnagramStore.startNewGame(game_obj);
        });

        AnagramStore.onScoreWord(word => {
            this.addWord(word);
        });

        this.game_obj = {
            letters: [],
            time: 30,
            score: 0,
            words: [],
        };
    }

    initNewGame(game_obj) {
        this.game_obj = game_obj;
    }

    getLetters() {
        return this.game_obj.letters;
    }

    getScore() {
        return this.game_obj.score;
    }

    addWord(word) {
        this.game_obj.words.push(word);

        this.game_obj.score += 10 * word.length;
    }

    isWordScored(word) {
        return this.game_obj.words.includes(word);
    }

    getWords() {
        return this.game_obj.words;
    }
}

export default new GameDB();