import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';

import RootReducer from './reducers';

const loggerMiddleware = createLogger();

const store = createStore(
    RootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

export default store;

