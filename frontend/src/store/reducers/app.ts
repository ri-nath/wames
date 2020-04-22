import { Action, initialState } from 'ts';

export default function app(state = initialState.app, action: Action) {
    switch (action.type) {
        case 'REQUEST_DATA':
            return { ...state, state: 'Loading' };
        case 'RECEIVE_DATA':
        case 'END_GAME':
            return { ...state, state: 'Menu' };
        case 'START_GAME':
            return { ...state, state: 'Anagram Game' };
        case 'SET_APP_STATE':
            return { ...state, state: action.state };
        default:
            return state;
    }
}
