import MicroEmitter from 'micro-emitter';

class AnagramStore {
    constructor() {
        this.emitter = new MicroEmitter();

        this.ref = null;
    }

    scoreWord(word) {
        this.emitter.emit('SCORE_WORD', word);
    }

    onScoreWord(handler) {
        this.emitter.on('SCORE_WORD', handler);
    }

    startNewGame(game_obj) {
        if (!this.ref) clearTimeout(this.ref);
        this.ref = setTimeout(() => {this.endGame(game_obj)}, game_obj.time * 1000);

        this.emitter.emit('START_GAME', game_obj);
    }

    onStartNewGame(handler) {
        this.emitter.on('START_GAME', handler);
    }

    endGame(game_obj) {
        if (!this.ref) clearTimeout(this.ref);

        this.emitter.emit('END_GAME', game_obj);
    }

    onEndGame(handler) {
        this.emitter.on('END_GAME', handler);
    }

    closeAllListeners() {
        this.emitter.off('SCORE_WORD');
        this.emitter.off('START_GAME');
        this.emitter.off('END_GAME');
    }
}

export default new AnagramStore();