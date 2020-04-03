import { AnagramConfig, AnagramObject, AnagramState, User } from '../../types';

export type Action = {
    type: string,
    [key: string]: any
}

export type State = {
    data: Data,
    app: AppState,
    menu: MenuState,
    anagram: GameState,
}

export type AppState = {
    state: 'LOADING' | 'MENU' | 'ANAGRAM_GAME'
}

export type Data = {
    user: Vow<User>
    anagram_games: Vow<AnagramObject[]>
}

export type MenuState = {
    screen: 'Settings' | 'Games List' | 'Home' | 'Game Portal' | 'NONE',
    portal_game: Nullable<AnagramObject>
    link: Nullable<string>
}

export type GameState = {
    active_game: Nullable<AnagramObject>,
}

export const initialState: State = {
    data: {
        user: null,
        anagram_games: null,
    },
    app: {
        state: 'LOADING'
    },
    menu: {
        screen: 'Home',
        portal_game: null,
        link: null,
    },
    anagram: {
        active_game: null,
    }
};

export type Vow<T> = null | 'FETCHING' | T | Error;
export type Nullable<T> = null | T;