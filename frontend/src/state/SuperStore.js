import MicroEmitter from 'micro-emitter';

import DB from './DB';

class SuperStore {
    constructor() {
        console.log("Starting up... ", new Date());

        this.emitter = new MicroEmitter();

        this.db = new DB();

        this.db.onGameCreation(game_object => {
            this.stateToAnagramGame(game_object)
        })
    }

    createAnagramGame(rival_id) {
        this.db.createGame(rival_id);
    }

    stateToAnagramGame(game_object) {
        console.log("New Anagram Game: ", new Date());

        this.emitter.emit('START_ANAGRAM_GAME', game_object);
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