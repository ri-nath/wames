import { AppState } from 'store/reducers/types';
import { Action } from 'store/actions/types';

export function setAppState(state: AppState['state']): Action {
    return {
        type: 'SET_STATE',
        state: state
    }
}