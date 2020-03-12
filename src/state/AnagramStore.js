import MicroEmitter from 'micro-emitter';

class AnagramStore {
    constructor() {
        this.emitter = new MicroEmitter();
    }

    scoreWord(word) {
        this.emitter.emit('SCORE_WORD', word);
    }

    onScoreWord(handler) {
        this.emitter.on('SCORE_WORD', handler);
    }

    stopListeningForWords() {
        this.emitter.off('SCORE_WORD');
    }

    startNewGame(letters) {
        this.emitter.emit('START_GAME', letters);
    }

    onStartNewGame(handler) {
        this.emitter.on('START_GAME', handler);
    }

    stopListeningForNewGame() {
        this.emitter.off('START_GAME');
    }
}

export default new AnagramStore();