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

    startNewGame() {
        GameDB.initNewGame().then(letters => {
            this.event_emitter.emit('START_GAME', letters)
        });
    }

    onStartNewGame(handler) {
        this.event_emitter.on('START_GAME', handler);
    }

    stopListeningForNewGame() {
        this.event_emitter.off('START_GAME');
    }
}

export default new GameStore();