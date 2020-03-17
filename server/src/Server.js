require('dotenv').config();

const AnagramUtil = require('./util/Anagram');

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function init(database) {
    server.listen(port, _ => console.log("Listening on port ", port));

    let sockets = [];

    io.on('connection', socket => {
        console.log('A socket connected! ' + new Date());

        socket.on('register-user', user_id => {
            socket.user_id = user_id;

            if (sockets.some(list_socket => list_socket.user_id === user_id)) {
                console.log('A user re-registered! ' + user_id);
                sockets.map(list_socket => list_socket.user_id === user_id ? socket : list_socket)
            } else {
                console.log('A user registered! ' + user_id);
                sockets.push(socket);
            }
        });

        // Args: id, rival_id
        socket.on('create-game', (id, rival_id) => {
            const game = AnagramUtil.generateGame(id, rival_id);
            database.createAnagramGame(game);

            socket.emit('return-game', game);
            sockets.filter(list_socket => list_socket.user_id === id || list_socket.user_id === rival_id).forEach(filtered_socket => filtered_socket.emit('add-game', game))
        });

        // Args: uuid, state
        socket.on('update-game-state', (uuid, state) => {
            const updater_id = socket.user_id;

            database.updateAnagramGame(uuid, updater_id, state)
                .then(document => Object.keys(document.value.states))
                .then(user_ids => {
                    user_ids.forEach(user_id => sockets.filter(list_socket => list_socket.user_id === user_id)
                        .forEach(filtered_socket => {
                            filtered_socket.emit('new-game-state', uuid, updater_id, state)
                    }))
                });
        });

        socket.on('disconnect', disconnected_socket => {
            console.log('A socket disconnected! ' + new Date());
            sockets = sockets.filter(list_socket => list_socket !== disconnected_socket);
        })
    });
}

module.exports = function() {
    this.init = init;
};
