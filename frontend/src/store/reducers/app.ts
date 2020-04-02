import { Action } from 'store/actions/types';
import { initialState } from './types';

export default function app(state = initialState.app, action: Action) {
    switch (action.type) {
        case 'SET_STATE':
            return {...state, state: action.state};
        default:
            return state;
    }
}



