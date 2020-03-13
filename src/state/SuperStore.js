import MicroEmitter from 'micro-emitter';

import * as Constants from '../constants';

class SuperStore {
    constructor() {
        this.emitter = new MicroEmitter();
    }

    stateToAnagramGame() {
        // TODO: server-side
        let letters = [];

        for (let i = 0; i < Constants.TILES; i++) {
            letters[i] = Constants.WEIGHTED_LETTERS[(Math.floor(Math.random() * Constants.WEIGHTED_LETTERS.length))];
        }

        const game_obj = {
            running: true,
            letters: letters,
            time: Constants.GAME_TIME,
            score: 0,
            words: []
        };

        // End TODO

        this.emitter.emit('START_ANAGRAM_GAME', game_obj);
    }

    onStateToAnagramGame(handler) {
        this.emitter.on('START_ANAGRAM_GAME', handler);
    }

    stateToMenu() {
        this.emitter.emit('START_MENU');
    }

    onStateToMenu(handler) {
        this.emitter.on('START_MENU', handler);
    }

    closeAllListeners() {
        this.emitter.off('START_ANAGRAM_GAME');
        this.emitter.off('START_MENU');
    }
}

export default new SuperStore();