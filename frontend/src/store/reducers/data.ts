import { Action, initialState } from 'store/types';
import { AnagramObject, AnagramState, User } from '../../../types';
import {getID, setState, setUser, sortByDate} from 'util/Anagram';
import {isResolved} from 'util/Vow';

export default function data(state = initialState.data, action: Action) {
    let anagram_games = state.anagram_games;

    switch (action.type) {
        case 'REQUEST_DATA':
            return {...state, user: 'FETCHING', anagram_games: 'FETCHING'};
        case 'RECEIVE_DATA':
            setUser(action.user);
            return {...state, user: action.user, anagram_games: action.games};
        case 'REQUEST_USER':
            return { ...state, user: 'FETCHING' };
        case 'RECEIVE_USER':
            setUser(action.user);
            return { ...state, user: action.user };
        case 'RECEIVE_GAME':
            if (!isResolved(anagram_games)) {
                anagram_games = [];
            };

            // @ts-ignore
            processLoadGame(action.game, anagram_games);

            return { ...state, anagram_games: anagram_games };
        case 'PROCESS_GAMES':
            if (!isResolved(anagram_games)) {
                anagram_games = [];
            }

            action.games.forEach((game: AnagramObject) => {
                // @ts-ignore
                processLoadGame(game, anagram_games);
            });

            // @ts-ignore
            anagram_games = sortByDate(anagram_games);

            return { ...state, anagram_games: anagram_games };
        case 'UPDATE_GAME_STATE':
            if (!isResolved(anagram_games)) {
                anagram_games = [];
            }

            // @ts-ignore
            processUpdateGame(action.game_id, anagram_games, action.state, action.user);

            return { ...state, anagram_games: anagram_games };
        default:
            return state;
    }
}

const processLoadGame = (game_object: AnagramObject,
                         game_array: AnagramObject[]) => {
    let index = game_array.findIndex(game => getID(game) === getID(game_object));

    if (index > -1) {
        game_array[index] = game_object;
    } else {
        game_array.push(game_object);
    }
};

const processUpdateGame = (game_id: string,
                           game_array: AnagramObject[],
                           updated_state: Partial<AnagramState>,
                           updating_user: User) => {
    let index = game_array.findIndex(game => getID(game) === game_id);

    if (index > -1) {
        setState(game_array[index], updating_user, updated_state);
    }
};