import WamesEmitter, {WamesListener} from 'lib/WamesEmitter';
import Anagram from 'lib/Anagram';

import ServerStore from 'server/ServerStore';

export enum SuperState {
    MENU = 'menu',
    ANAGRAM_GAME ='anagram',
    LOADING = 'loading'
};

class SuperStore {
    private emitter: WamesEmitter;
    private state: SuperState;

    constructor() {
        this.emitter = new WamesEmitter();

        this.state = SuperState.LOADING;

        for (const state of Object.values(SuperState)) {
            this.emitter.on('to-' + state, () => {
                this.state = state;
            })
        }

        ServerStore.onConnect(() => {
            this.setState(SuperState.MENU);
        })
    }

    setState(state: SuperState, args?: any) {
        this.emitter.emit('to-' + state, args);
    }

    onSetState(state: SuperState, handler: Function): WamesListener {
        return this.emitter.wrappedListen('to-' + state, handler);
    }

    setStateToAnagramGame(game: Anagram) {
        this.emitter.emit('to-' + SuperState.ANAGRAM_GAME, game);
    }

    onStateToAnagramGame(handler: (game: Anagram) => void): WamesListener {
        return this.emitter.wrappedListen('to-' + SuperState.ANAGRAM_GAME, handler);
    }
}

export default new SuperStore();