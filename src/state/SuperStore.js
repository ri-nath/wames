import MicroEmitter from 'micro-emitter';

import * as Constants from '../constants';

import AnagramStore from './AnagramStore';

class SuperStore {
    constructor() {
        this.emitter = new MicroEmitter();
    }

    startAnagramGame() {
        let letters = [];

        for (let i = 0; i < Constants.TILES; i++) {
            letters[i] = Constants.WEIGHTED_LETTERS[(Math.floor(Math.random() * Constants.WEIGHTED_LETTERS.length))];
        }

        this.emitter.emit('START_ANAGRAM_GAME', letters);
    }

    onStartAnagramGame(handler) {
        this.emitter.on('START_ANAGRAM_GAME', handler);
    }
}

export default new SuperStore();