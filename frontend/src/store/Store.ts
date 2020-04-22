import { isError } from 'api';
import { Linking } from 'expo';
import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { openGamePortal, processGames, receiveCreatedGame, updateGameState } from 'store/actions';
import Client from 'store/Client';

import { AnagramObject, Nullable, State } from 'ts';

import RootReducer from './reducers';


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

    console.log(`Linked to app with path: ${ path } and data: ${ JSON.stringify(queryParams) }`);

    if (path && queryParams && queryParams.id) {
        Client.joinGameByID(queryParams.id, (res: AnagramObject | Error) => {
            console.log('RES', res);
            if (res.toString() === 'Already in game!') {
                // @ts-ignore
                const game = store.getState().data.anagram_games.find((game: AnagramObject) => getID(game) === queryParams.id);

                store.dispatch(openGamePortal(game));
            } else {
                if (!isError(res)) store.dispatch(receiveCreatedGame(res as AnagramObject));
            }
        });
    }
};

export default store;

