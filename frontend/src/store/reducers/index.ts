import { combineReducers } from 'redux';

import anagram from './anagram';
import app from './app';
import data from './data';
import menu from './menu';

const RootReducer = combineReducers({
    data: data,
    app: app,
    menu: menu,
    anagram: anagram
});

export default RootReducer;