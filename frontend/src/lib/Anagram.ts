import { AnagramConfig, AnagramObject, AnagramState, User } from '../../types';

import * as PConstants from 'constants';

export default class Anagram {
    private readonly game_object: AnagramObject;
    private readonly local_user_id: string;

    constructor(game_object: AnagramObject, local_user_id: string) {
        this.game_object = game_object;
        this.local_user_id = local_user_id;
    }

    getID(): string {
        return this.game_object.uuid;
    }

    getConfig(): AnagramConfig {
        return this.game_object.config;
    }

    getState(user_id: string): AnagramState {
        return this.game_object.states[user_id];
    }

    getLocalState() : AnagramState {
        return this.getState(this.local_user_id);
    }

    setState(username: string, state: Partial<AnagramState>) {
        this.game_object.states[username] = {
            ...this.game_object.states[username],
            ...state
        }
    }

    setLocalState(state: Partial<AnagramState>) {
        this.setState(this.local_user_id, state);
    }

    lazyScoreWord(word: string) {
        this.getLocalState().words.push(word);
        this.getLocalState().score = this.getLocalState().score + word.length * 100;
    }

    getPlayers(): User[] {
        return this.game_object.users;
    }

    getObject(): AnagramObject {
        return this.game_object;
    }
}