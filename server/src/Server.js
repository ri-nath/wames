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

        if (socket.user_id) {
            console.log('A user re-registered! ' + user_id);

            if (sockets.includes(socket)) {
                sockets.map(list_socket => list_socket.user_id === user_id ? socket : list_socket)
            } else {
                sockets.push(socket);
            }
        }

        socket.on('register-user', user_id => {
            socket.user_id = user_id;

            if (sockets.some(list_socket => list_socket.user_id === user_id)) {
                console.log('A user requested to re-register! ' + user_id);
                sockets.map(list_socket => list_socket.user_id === user_id ? socket : list_socket)
            } else {
                console.log('A user registered! ' + user_id);
                sockets.push(socket);
            }

            database.getUserAnagramGames(user_id)
                .then(documents => {
                    documents.toArray((err, result) => {
                       if (err) throw err;

                       socket.emit('new-games', result);
                    });
                });
        });

        // Args: id, rival_id
        socket.on('create-game', (...target_ids) => {
            console.log('Creating game for: ', target_ids.join(' '));

            target_ids.push(socket.user_id);

            const game = AnagramUtil.generateGame(...target_ids);
            database.createAnagramGame(game);

            sockets.filter(list_socket => target_ids.includes(list_socket.user_id))
                .forEach(target_socket => target_socket.join(game.uuid));

            socket.emit('return-game', game);
            socket.broadcast.to(game.uuid).emit('new-games', [game]);
        });

        socket.on('set-user-id', user_id => {
            if (sockets.every(list_socket => list_socket.user_id !== user_id)) {
                socket.user_id = user_id;
            }

            socket.emit('new-user-id', socket.user_id);
        });

        socket.on('join-game', uuid => {
            database.getAnagramGame(uuid).then(doc => {
                if (doc === null) {
                    socket.emit('joined-game', new Error('Game ' + uuid + ' not found!'));
                } else {
                    socket.join(uuid);

                    const user_id = socket.user_id;
                    const game = doc.value;
                    AnagramUtil.addUserToGame(game, user_id);

                    const new_state = game.states[user_id];

                    database.updateAnagramGame(uuid, user_id, new_state)
                        .then(_ => {
                            socket.emit('joined-game', game);
                            socket.broadcast.to(game.uuid).emit('new-game-state', uuid, user_id, new_state);
                        })
                }
            });
        });

        // Args: uuid, state
        socket.on('update-game-state', (uuid, new_state) => {
            const updater_id = socket.user_id;

            database.updateAnagramGame(uuid, updater_id, new_state)
                .then(doc => doc.value)
                .then(game => {
                    socket.broadcast.to(game.uuid).emit('new-game-state', uuid, updater_id, new_state);
                });
        });

        socket.on('disconnect', socket => {
            console.log('A socket disconnected! ' + new Date());
            console.log('A user disconnected! ' + socket.user_id);
            sockets = sockets.filter(list_socket => list_socket !== socket);
        })
    });
}

module.exports = function() {
    this.init = init;
};
