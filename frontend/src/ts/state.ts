import { AnagramObject, User } from '.';

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
    state: 'Loading' | 'Menu' | 'Anagram Game'
}

export type Data = {
    user: Vow<User>
    anagram_games: Vow<AnagramObject[]>
}

export type MenuState = {
    screen: 'Menu' | 'Game Portal',
    portal_game: Vow<AnagramObject>
    link: Nullable<string>
}

export type GameState = {
    active_game: Nullable<AnagramObject>,
}

export const initialState: State = {
    data: {
        user: null,
        anagram_games: null
    },
    app: {
        state: 'Loading'
    },
    menu: {
        screen: 'Menu',
        portal_game: null,
        link: null
    },
    anagram: {
        active_game: null
    }
};

export type Vow<T> = Nullable<'FETCHING' | T | Error>;
export type Nullable<T> = null | T;