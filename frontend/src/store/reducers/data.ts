import { getID, isResolved, setState, setUser, sortByDate } from 'api';
import { Action, AnagramObject, AnagramState, Data, initialState, User } from 'ts';

export default function data(state = initialState.data, action: Action): Data {
    let anagram_games = state.anagram_games;

    switch (action.type) {
        case 'REQUEST_DATA':
            return { ...state, user: 'FETCHING', anagram_games: 'FETCHING' };
        case 'RECEIVE_DATA':
            setUser(action.user);
            return { ...state, user: action.user, anagram_games: action.games };
        case 'REQUEST_USER':
            return { ...state, user: 'FETCHING' };
        case 'RECEIVE_USER':
            setUser(action.user);
            return { ...state, user: action.user };
        case 'RECEIVE_GAME':
            if (!isResolved(anagram_games)) {
                anagram_games = [];
            }

            anagram_games = processLoadGame(action.game, anagram_games as AnagramObject[]);

            return { ...state, anagram_games: anagram_games };
        case 'PROCESS_GAMES':
            if (!isResolved(anagram_games)) {
                anagram_games = [];
            }

            action.games.forEach((game: AnagramObject) => {
                anagram_games = processLoadGame(game, anagram_games as AnagramObject[]);
            });

            anagram_games = sortByDate(anagram_games as AnagramObject[]);

            return { ...state, anagram_games: anagram_games };
        case 'UPDATE_GAME_STATE':
            if (!isResolved(anagram_games)) {
                anagram_games = [];
            }

            anagram_games = processUpdateGame(action.game_id, anagram_games as AnagramObject[], action.state, action.user);

            return { ...state, anagram_games: anagram_games };
        default:
            return state;
    }
}

const processLoadGame = (game_object: AnagramObject,
                         game_array: AnagramObject[]) => {
    let ret_array = [...game_array];

    let index = ret_array.findIndex(game => getID(game) === getID(game_object));

    if (index > -1) {
        ret_array[index] = game_object;
    } else {
        ret_array.push(game_object);
    }

    return ret_array;
};

const processUpdateGame = (game_id: string,
                           game_array: AnagramObject[],
                           updated_state: Partial<AnagramState>,
                           updating_user: User) => {
    let ret_array = [...game_array];

    let index = ret_array.findIndex(game => getID(game) === game_id);

    if (index > -1) {
        ret_array[index] = setState(ret_array[index], updating_user, updated_state);
    }

    return ret_array;
};