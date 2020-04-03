import { Action, initialState } from 'store/types';

export default function app(state = initialState.app, action: Action) {
    switch (action.type) {
        case 'REQUEST_DATA':
            return { ...state, state: 'LOADING' };
        case 'RECIEVE_DATA':
        case 'END_GAME':
            return { ...state, state: 'MENU' };
        case 'START_GAME':
            return { ...state, state: 'ANAGRAM_GAME' };
        default:
            return state;
    }
}
