import {applyMiddleware, createStore, Store} from 'redux';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';

import { Linking } from 'expo';

import RootReducer from './reducers';
import Client from 'store/Client';
import {openGamePortal, processGames, receiveCreatedGame, updateGameState} from 'store/actions';

import {Nullable, State} from 'store/types';
import { AnagramObject } from '../../types';
import {isError} from 'util/Error';
import {getID} from 'util/Anagram';


const loggerMiddleware = createLogger();

const store: Store<State> = createStore(
    RootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

// SET LISTENERS
Client.onNewGames(games => {
    store.dispatch(processGames(games));
});

Client.onNewGameState((game_id, updating_user, updated_state) => {
    store.dispatch(updateGameState(game_id, updating_user, updated_state));
});

Linking.getInitialURL().then((res: Nullable<string>) => {
    if (res) {
        parseURL(res);
    }
});

Linking.addEventListener('url', (event) => parseURL(event.url));

const parseURL = (url: string) => {
    let { path, queryParams } = Linking.parse(url);

    console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);

    if (path && queryParams && queryParams.id) {
        Client.joinGameByID(queryParams.id, (res: AnagramObject | 'Already in game!') => {
            console.log("RES", res);
            if (res === 'Already in game!') {
                // @ts-ignore
                const game = store.getState().data.anagram_games.find((game: AnagramObject) => getID(game) === queryParams.id);

                store.dispatch(openGamePortal(game));
            } else {
                store.dispatch(receiveCreatedGame(res));
            }
        })
    }
};

export default store;

