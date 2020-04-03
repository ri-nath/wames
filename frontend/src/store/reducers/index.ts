import { combineReducers } from 'redux';

import anagram from './anagram';
import menu from './menu';
import app from './app';
import data from './data';

const RootReducer = combineReducers({
    data: data,
    app: app,
    menu: menu,
    state: anagram,
});

export default RootReducer;