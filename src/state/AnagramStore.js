import MicroEmitter from 'micro-emitter';

import SuperStore from './SuperStore'

class AnagramStore {
    constructor() {
        this.emitter = new MicroEmitter();

        this.game_instances = [];
        this.active_game = null;
        this.timeout = null;

        SuperStore.onStateToAnagramGame(game_obj => {
            this.startNewGame(game_obj);
        })
    }

    scoreWord(word) {
        this.active_game.addWord(word);

        this.emitter.emit('SCORE_WORD', this.active_game);
    }

    onScoreWord(handler) {
        this.emitter.on('SCORE_WORD', handler);
    }

    startNewGame(game_obj) {
        this.active_game = game_obj;

        if (!this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {this.endGame(this.active_game)}, this.active_game.state.time * 1000);

        this.emitter.emit('START_GAME', game_obj);
    }

    onStartNewGame(handler) {
        this.emitter.on('START_GAME', this.active_game);
    }

    endGame() {
        if (!this.timeout) clearTimeout(this.timeout);

        this.active_game.state.running = false;
        this.game_instances.push(this.active_game);

        this.emitter.emit('END_GAME', this.active_game);
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