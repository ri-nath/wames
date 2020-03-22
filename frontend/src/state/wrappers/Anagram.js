import Centralizer from '../Centralizer';

export const AnagramState = {
    NOT_STARTED: 'not-started',
    PLAYING: 'running',
    FINISHED: 'finished'
};

export default class Anagram {
    constructor(game_object) {
        this.game_object = game_object;
    }

    getID() {
        return this.game_object.uuid;
    }

    getConfig() {
        return this.game_object.config;
    }

    getState(username) {
        return this.game_object.states[username];
    }

    getLocalState() {
        return this.getState(Centralizer.getUsername());
    }

    setState(username, state) {
        if (state.stage && !Object.values(AnagramState).includes(state.stage)) throw "Invalid state, stage: " + state.stage;

        this.game_object.states[username] = {
            ...this.game_object.states[username],
            ...state
        }
    }

    setLocalState(state) {
        this.setState(Centralizer.getUsername(), state);
    }

    lazyScoreWord(word) {
        this.getLocalState().words.push(word);
        this.getLocalState().score = this.getLocalState().score + word.length * 100;
    }

    getPlayers() {
        return Object.keys(this.game_object.states);
    }

    getObject() {
        return this.game_object;
    }
}