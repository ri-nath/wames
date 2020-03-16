import MicroEmitter from 'micro-emitter';

import SuperStore from './SuperStore'
import AnagramGame from './AnagramGame'

class AnagramStore {
    constructor() {
        this.emitter = new MicroEmitter();

        this.game_instances = [];

        this.active_game = null;
        this.timeout = null;

        SuperStore.onStateToAnagramGame(game_obj => {
            this.startNewGame(new AnagramGame(game_obj, SuperStore.user_id));
        });

        SuperStore.db.onAddGame(game => {
            if (this.game_instances.every(game_obj => game_obj.uuid !== game.uuid)) {
                this.game_instances.push(new AnagramGame(game, SuperStore.user_id));
            }

            this.emitter.emit('UPDATE_GAMES_LIST')
        });

        SuperStore.db.onNewGameState((uuid, user_id, state) => {
            const index = this.game_instances.findIndex(game_obj => game_obj.uuid = uuid);

            console.log('NUB');
            console.log(state);

            if (index !== -1) {
                this.game_instances[index].setState(user_id, state);
            }

            this.emitter.emit('UPDATE_GAMES_LIST')
        })
    }

    scoreWord(word) {
        this.active_game.scoreWordOnLocalState(word);

        this.emitter.emit('SCORE_WORD', this.active_game);
    }

    onScoreWord(handler) {
        this.emitter.on('SCORE_WORD', handler);
    }

    startNewGame(state_handler) {
        this.active_game = state_handler;

        if (!this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.endGame(this.active_game)
        }, this.active_game.config.duration * 1000);

        this.active_game.setLocalState({
            stage: 'running'
        });

        if (this.game_instances.every(game_instance => game_instance.uuid !== this.active_game.uuid)) {
            this.game_instances.push(this.active_game);
        }

        this.emitter.emit('START_GAME', this.active_game);
    }

    onStartNewGame(handler) {
        this.emitter.on('START_GAME', handler);
    }

    endGame() {
        if (!this.timeout) clearTimeout(this.timeout);

        this.active_game.setLocalState({
            stage: 'finished'
        });

        SuperStore.db.updateGameState(
            this.active_game.uuid,
            this.active_game.getLocalState()
        );

        this.emitter.emit('END_GAME', this.active_game);
    }

    onEndGame(handler) {
        this.emitter.on('END_GAME', handler);
    }

    onUpdateGamesList(handler) {
        this.emitter.on('UPDATE_GAMES_LIST', handler);
    }

    closeAllListeners() {
        this.emitter.off('SCORE_WORD');
        this.emitter.off('START_GAME');
        this.emitter.off('END_GAME');
        this.emitter.off('UPDATE_GAMES_LIST');
    }
}

export default new AnagramStore();