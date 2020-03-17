import socketIOClient from 'socket.io-client'
import { ENDPOINT } from 'react-native-dotenv'

export default class DB {
    constructor() {
        this.socket = socketIOClient(ENDPOINT);
        this.user_id = Math.random().toString(36).substring(7); // TODO: implement properly

        this.socket.emit('register-user', this.user_id);

        setInterval(() => {
            console.log(new Date());
            if (this.socket.connected) console.log('Socket Connected!')
        }, 5000);

        this.socket.on('connect', _ => {
            if (this.socket.connected) console.log('Socket Connected!');
            else (console.log('Not Connected!'))
        });
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