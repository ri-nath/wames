import * as Constants from "../constants";

import SuperStore from './SuperStore';
import AnagramStore from './AnagramStore';

/*
 * Game Object:
 * {
 *   running: boolean
 *   letters: String arr ex. ["E", "T", "C"... ],
 *   time: int un. seconds
 *   score: int un. Points
 *   words: String arr ex. ["lorem", "ipsum"...]
 * }
 *
 */

class GameDB {
    constructor() {
        SuperStore.onStateToAnagramGame(game_obj => {
            this.setGameState(game_obj);

            AnagramStore.startNewGame(game_obj);
        });

        AnagramStore.onScoreWord(word => {
            this.addWord(word);
        });

        AnagramStore.onEndGame(game_obj => {
            this.setGameState(game_obj);
        });

        this.game_obj = {
            running: true,
            letters: [],
            time: 0,
            score: 0,
            words: [],
        };
    }

    setGameState(game_obj) {
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

        this.game_obj.score += 100 * word.length;
    }

    isWordScored(word) {
        return this.game_obj.words.includes(word);
    }

    getWords() {
        return this.game_obj.words;
    }

    getGameState() {
        return this.game_obj;
    }
}

export default new GameDB();