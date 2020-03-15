import MicroEmitter from 'micro-emitter';

import * as Constants from '../constants';

import AnagramStateHandler from "./AnagramStateHandler";

class SuperStore {
    constructor() {
        this.emitter = new MicroEmitter();

        this.user_id = 'CRAUEL';
    }

    stateToAnagramGame(game_object) {
        console.log("New Anagram Game: ", new Date());

        // TODO: server-side

        const state_handler = new AnagramStateHandler(game_object, this.user_id);

        // End TODO

        this.emitter.emit('START_ANAGRAM_GAME', state_handler);
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