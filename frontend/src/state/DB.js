import io from 'socket.io-client'

import * as Constants from '../constants';

export default class DB {
    constructor() {
        this.socket = io(Constants.SERVER_ENDPOINT);
        this.user_id = Math.random().toString(36).substring(7); // TODO: implement properly

        this.socket.on('connect', _ => {
            console.log('Socket Connected!');
            this.socket.emit('register-user', this.user_id);
        });

        this.socket.on('reconnect', _ => {
            console.log('Socket Reconnected!');
            this.socket.emit('register-user', this.user_id);
        });

        this.socket.on('disconnect', _ => {
            console.log('Socket Disconnected!');
        })
    }

    createGame(user_id, rival_id) {
        this.socket.emit('create-game', user_id, rival_id);
    }

    onGameCreation(handler) {
        this.socket.on('return-game', handler);
    }

    onNewGames(handler) {
        // params: game
        this.socket.on('new-games', handler);
    }

    updateGameState(uuid, state) {
        this.socket.emit('update-game-state', uuid, state);
    }

    onNewGameState(handler) {
        //params: uuid, user_id, new state
        this.socket.on('new-game-state', handler);
    }
}