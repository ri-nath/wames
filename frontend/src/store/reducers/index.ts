import { combineReducers } from 'redux';
import {AnagramObject, User} from '../../../types';
import {Action} from 'store/actions';
import store from 'store/Store';
import {State} from 'store/reducers/types';
import anagramReducer from 'store/reducers/anagram_reducer.js';
import menu from 'menu.ts';
import app from 'app.ts';
import data from 'data.ts';

const RootReducer = combineReducers({
    data: data,
    app: app,
    menu: menu,
    state: anagramReducer,
});

export default RootReducer;