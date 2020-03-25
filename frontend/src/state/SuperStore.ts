import MicroEmitter from 'micro-emitter';

import { AnagramObject } from '../../types';

import DB from './DB';
import Anagram from './wrappers/Anagram';

export enum SuperState {
    MENU = 'menu',
    ANAGRAM_GAME ='anagram',
    LOADING = 'loading'
};

class SuperStore {
    private emitter: MicroEmitter;
    private state: SuperState;

    constructor() {
        this.emitter = new MicroEmitter();

        this.state = SuperState.LOADING;

        for (const state of Object.values(SuperState)) {
            this.emitter.on('to-' + state, () => {
                this.state = state;
            })
        }

        DB.onConnect(() => {
            this.setState(SuperState.MENU);
        })
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

        // @ts-ignore
        this.emitter.off('change-username');
    }
}

export default new SuperStore();