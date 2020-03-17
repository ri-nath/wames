import io from 'socket.io-client'

export default class DB {
    constructor() {
        this.socket = io('https://word-games-server.herokuapp.com');
        this.user_id = Math.random().toString(36).substring(7); // TODO: implement properly

        this.socket.emit('register-user', this.user_id);

        this.socket.on('connect', _ => {
            if (this.socket.connected) console.log('Socket Connected!');
            else (console.log('Not Connected!'))
        });

        this.socket.on('disconnect', _ => {
            if (this.socket.connected) console.log('Socket Connected!');
            else (console.log('Not Connected!'))
        })
    }

    createGame(user_id, rival_id) {
        this.socket.emit('create-game', user_id, rival_id);
    }

    onGameCreation(handler) {
        this.socket.on('return-game', handler);
    }

    onAddGame(handler) {
        // params: game
        this.socket.on('add-game', handler);
    }

    updateGameState(uuid, state) {
        this.socket.emit('update-game-state', uuid, state);
    }

    onNewGameState(handler) {
        //params: uuid, user_id, new state }
        this.socket.on('new-game-state', handler);
    }
}