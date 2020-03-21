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
        });

        this.onSetUsername(new_user_id => {
            this.user_id = new_user_id;
        })
    }

    createGame(...target_ids) {
        this.socket.emit('create-game', this.user_id, ...target_ids);
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

    setUsername(user_id) {
        this.socket.emit('set-user-id', user_id);
    }

    onSetUsername(handler) {
        this.socket.on('new-user-id', handler);
    }
}