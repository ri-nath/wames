import { Action, initialState } from 'store/types';
import { AnagramObject, AnagramState, User } from '../../../types';
import { getID, setState } from 'util/Anagram';

export default function data(state = initialState.data, action: Action) {
    const anagram_games = state.anagram_games;

    switch (action.type) {
        case 'REQUEST_DATA':
            return {...state, user: 'FETCHING', anagram_games: 'FETCHING'};
        case 'RECEIVE_DATA':
            return {...state, user: action.user, anagram_games: action.games}
        case 'REQUEST_USER':
            return { ...state, user: 'FETCHING' };
        case 'RECEIVE_USER':
            return { ...state, user: action.user };
        case 'PROCESS_GAMES':
            // TODO: look into https://github.com/rt2zz/redux-action-buffer
            if (anagram_games instanceof Array) {
                action.games.forEach((game: AnagramObject) => {
                    processLoadGame(game, anagram_games);
                });

                return { ...state, anagram_games: anagram_games };
            }

            return state;
        case 'UPDATE_GAME_STATE':
            if (anagram_games instanceof Array) {
                processUpdateGame(action.game_id, anagram_games, action.state, action.user);

                return { ...state, anagram_games: anagram_games }
            }

            return state;
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