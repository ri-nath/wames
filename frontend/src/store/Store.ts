import { getID, isAnyError, isResolved, setUser } from 'api';
import { Linking } from 'expo';
import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { openGamePortal, processGames, receiveCreatedGame, updateGameState } from 'store/actions';
import Client from 'store/Client';

import { AnagramObject, Nullable, State, User } from 'ts';

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
    console.log(updated_state);
    store.dispatch(updateGameState(game_id, updating_user, updated_state));
});

Linking.getInitialURL().then((res: Nullable<string>) => {
    if (res) {
        parseURL(res);
    }
});

store.subscribe(() => {
    if (isResolved(store.getState().data.user)) setUser(store.getState().data.user as User);
})

Linking.addEventListener('url', (event) => parseURL(event.url));

const parseURL = (url: string) => {
    let { path, queryParams } = Linking.parse(url);

    console.log(`Linked to app with path: ${ path } and data: ${ JSON.stringify(queryParams) }`);

    // if (path && queryParams && queryParams.id) {
    //     Client.joinGameByID(queryParams.id, res => {
    //         console.log('RES', res);
    //         if (res.toString() === 'Already in game!') {
    //             const game = store.getState()!.data.anagram_games.find((game: AnagramObject) => getID(game) === queryParams.id);
    //
    //             store.dispatch(openGamePortal(game));
    //         } else {
    //             if (!isAnyError(res)) store.dispatch(receiveCreatedGame(res as AnagramObject));
    //         }
    //     });
    // }
};

export default store;

