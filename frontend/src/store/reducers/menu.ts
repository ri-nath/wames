import { Action, initialState } from 'store/types';

export default function menu(state = initialState.menu, action: Action) {
    switch(action.type) {
        case 'REQUEST_CREATED_GAME':
            return { ...state, state: 'ANAGRAM_PORTAL', portal_game: 'FETCHING' };
        case 'RECIEVE_GAME':
        case 'OPEN_GAME_PORTAL':
            return { ...state, state: 'ANAGRAM_PORTAL', portal_game: action.game };
        case 'SET_SCREEN':
            return { ...state, state: action.screen };
        default:
            return state;
    }
}