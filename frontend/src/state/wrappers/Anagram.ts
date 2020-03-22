import Centralizer from '../Centralizer';

export enum AnagramStage {
    NOT_STARTED = 'not-started',
    PLAYING = 'running',
    FINISHED = 'finished'
}

export interface AnagramState {
    stage: AnagramStage,
    words: string[],
    score: number
}

export interface AnagramConfig {
    letters: string[],
    duration: number
}

export interface AnagramObject {
    uuid: number,
    states: { [username: string]: AnagramState },
    config: AnagramConfig
}

export default class Anagram {
    private game_object: AnagramObject;

    constructor(game_object: AnagramObject) {
        this.game_object = game_object;
    }

    getID(): number {
        return this.game_object.uuid;
    }

    getConfig(): AnagramConfig {
        return this.game_object.config;
    }

    getState(username: string): AnagramState {
        return this.game_object.states[username];
    }

    getLocalState() : AnagramState {
        return this.getState(Centralizer.getUsername());
    }

    setState(username: string, state: Partial<AnagramState>) {
        this.game_object.states[username] = {
            ...this.game_object.states[username],
            ...state
        }
    }

    setLocalState(state: Partial<AnagramState>) {
        this.setState(Centralizer.getUsername(), state);
    }

    lazyScoreWord(word: string) {
        this.getLocalState().words.push(word);
        this.getLocalState().score = this.getLocalState().score + word.length * 100;
    }

    getPlayers(): string[] {
        return Object.keys(this.game_object.states);
    }

    getObject(): AnagramObject {
        return this.game_object;
    }
}