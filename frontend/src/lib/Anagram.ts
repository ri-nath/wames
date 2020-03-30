import { AnagramConfig, AnagramObject, AnagramState, User } from '../../types';

import moment from 'moment';

export default class Anagram {
    private readonly game_object: AnagramObject;
    private readonly local_user_id: string;
    private readonly date_string: string;

    constructor(game_object: AnagramObject, local_user_id: string) {
        this.game_object = game_object;
        this.local_user_id = local_user_id;

        const timestamp = new Date(
            parseInt(this.getID().substring(0, 8), 16) * 1000
        )

        this.date_string = moment(timestamp).format('MMMM Do, h:mm a')
    }

    getID(): string {
        return this.game_object._id;
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

    hasBeenViewed(): boolean {
        return this.getLocalState().viewed;
    }

    markAsViewed(): void {
        this.getLocalState().viewed = true;
    }

    getDate(): string {
        return this.date_string;
    }
}