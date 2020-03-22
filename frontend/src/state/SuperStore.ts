import MicroEmitter from 'micro-emitter';

import DB from './DB';
import Anagram, {AnagramObject} from './wrappers/Anagram';

export enum SuperState {
    MENU = 'menu',
    ANAGRAM_GAME ='anagram'
};

class SuperStore {
    private emitter: MicroEmitter;
    private state: SuperState;

    constructor() {
        this.emitter = new MicroEmitter();

        this.state = SuperState.MENU;

        DB.onGameCreation((game_object: AnagramObject) => {
            this.setState(SuperState.ANAGRAM_GAME, new Anagram(game_object));
        });
    }

    setState(state: SuperState, args?: any) {
        this.emitter.emit('to-' + state, args);
    }

    onSetState(state: SuperState, handler: Function) {
        this.emitter.on('to-' + state, handler);
    }

    closeAllListeners() {
        for (const state of Object.values(SuperState)) {
            // @ts-ignore
            this.emitter.off(state);
        }
    }
}

export default new SuperStore();