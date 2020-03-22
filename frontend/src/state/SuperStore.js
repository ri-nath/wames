import MicroEmitter from 'micro-emitter';

import DB from './DB';
import Anagram from './wrappers/Anagram';

export const State = {
    MENU: 'menu',
    ANAGRAM_GAME: 'anagram'
};

class SuperStore {
    constructor() {
        this.emitter = new MicroEmitter();

        this.state = State.MENU;

        DB.onGameCreation(game_object => {
            this.setState(State.ANAGRAM_GAME, new Anagram(game_object));
        });
    }

    setState(state, args) {
        if (!Object.values(State).includes(state)) throw "Invalid state! " + state;
        this.emitter.emit('to-' + state, args);
    }

    onSetState(state, handler) {
        if (!Object.values(State).includes(state)) throw "Invalid state! " + state;
        this.emitter.on('to-' + state, handler);
    }

    closeAllListeners() {
        for (const state of Object.values(State)) {
            this.emitter.off(state);
        }
    }
}

export default new SuperStore();