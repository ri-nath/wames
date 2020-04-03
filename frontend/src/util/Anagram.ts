import moment from 'moment';

import { AnagramConfig, AnagramObject, AnagramState, User } from '../../types';

export let m_user: User = {
    username: '',
    user_id: '',
};

export function setUser(user: User) {
    m_user = user;
}

export function getID(obj: AnagramObject): string {
    return obj._id;
}

export function getConfig(obj: AnagramObject): AnagramConfig {
    return obj.config;
}

export function getState(obj: AnagramObject, user: User): AnagramState {
    return obj.states[user.user_id];
}

export function setState(obj: AnagramObject, user: User, state: Partial<AnagramState>) {
    obj.states[user.user_id] = {
        ...obj.states[user.user_id],
        ...state
    };

    return obj;
}

export function getPlayers(obj: AnagramObject): User[] {
    return obj.users;
}

export function getTimestamp(obj: AnagramObject): number {
    return parseInt(getID(obj).substring(0, 8), 16);
}

export function getDateString(obj: AnagramObject): string {
    const date = new Date(getTimestamp(obj) * 1000);

    return moment(date).format('MMMM Do, h:mm a')
}

export function sortByDate(objs: AnagramObject[]): AnagramObject[] {
    objs.sort((a, b) => getTimestamp(b) - getTimestamp(a));

    return objs;
}

export function lazyGetState(obj: AnagramObject) {
    return getState(obj, m_user);
}

export function lazySetState(obj: AnagramObject, state: Partial<AnagramState>) {
    return setState(obj, m_user, state);
}

export function lazyEndGame(obj: AnagramObject) {
    return setState(obj, m_user, {
        stage: 'FINISHED',
    })
}

export function lazySetViewed(obj: AnagramObject): void {
    lazySetState(obj, {
        viewed: true,
    })
}

export function lazyGetViewed(obj: AnagramObject,): boolean {
    return lazyGetState(obj).viewed;
}

export function lazyScoreWord(obj: AnagramObject, word: string) {
    const state = getState(obj, m_user);

    let words = state.words;
    words.push(word);

    let score = state.score;
    score += word.length * 100;

    lazySetState(obj, {
        words: words,
        score: score
    });

    return obj;
}