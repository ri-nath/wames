import MicroEmitter from 'micro-emitter';

import GameDB from './GameDB';

class GameStore {
    constructor() {
        this.event_emitter = new MicroEmitter();
    }

    scoreWord(word) {
        GameDB.addWord(word);

        this.event_emitter.emit('SCORE_WORD', word);
    }

    onScoreWord(handler) {
        this.event_emitter.on('SCORE_WORD', handler);
    }

    stopListeningForWords() {
        this.event_emitter.off('SCORE_WORD');
    }
}

export default new GameStore();