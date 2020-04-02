import {AnagramConfig, AnagramObject, AnagramState, User} from '../../../types';

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
    state: 'SETTINGS' | 'GAMES_LIST' | 'HOME' | 'ANAGRAM_PORTAL',
    portal_game: Nullable<AnagramObject>
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
        state: 'HOME',
        portal_game: null,
    },
    anagram: {
        active_game: null,
    }
};

export type Vow<T> = null | 'FETCHING' | T | Error;
export type Nullable<T> = null | T;