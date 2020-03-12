import MicroEmitter from 'micro-emitter';

import AnagramDB from './AnagramDB';

class AnagramStore {
    constructor() {
        this.event_emitter = new MicroEmitter();
    }

    scoreWord(word) {
        AnagramDB.addWord(word);

        this.event_emitter.emit('SCORE_WORD', word);
    }

    onScoreWord(handler) {
        this.event_emitter.on('SCORE_WORD', handler);
    }

    stopListeningForWords() {
        this.event_emitter.off('SCORE_WORD');
    }

    startNewGame() {
        AnagramDB.initNewGame().then(letters => {
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

export default new AnagramStore();