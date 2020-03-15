require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const mongodb = require('mongodb');
const assert = require('assert');

const uuidv4 = require('uuid/v4');

const util = require('./util');

// end imports

const MongoClient = mongodb.MongoClient;

const connection_string = process.env.DB_URI;
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const cluster = new MongoClient(connection_string, { useNewUrlParser: true });

let collection;

// end setup

cluster.connect(err => {
    assert.equal(null, err);
    console.log("Connected successfully to cluster!");

    collection = cluster.db("anagram-game").collection("games");

    initServer();
});

function initServer() {
    let sockets = {};

    io.on('connection', socket => {
        console.log('A socket connected!');

        socket.on('register-user', user_id => {
            sockets[user_id] = socket;

            socket.user_id = user_id;
        });

        socket.on('create-game', (id, rival_id) => {
            const game = generateAnagramGame(id, rival_id);
            createGame(game);

            [id, rival_id].filter(user_id => sockets[user_id]).forEach(socket => {
                socket.emit('add-game', game);
            });
        });

        socket.on('update-game-state', (uuid, state) => {
            const user_id = socket.user_id;

            updateGame(uuid, user_id, state);

            Object.keys(getGame(uuid).states).filter(user_id => sockets[user_id]).forEach(socket => {
                socket.emit('new-game-state', uuid, { [user_id]: state });
            })
        });

        socket.on('disconnect', socket => {
            delete sockets[socket.user_id];
        })
    });

    server.listen(port, _ => console.log("Listening on port ", port));
}

function generateAnagramGame(user_id, rival_id, length = 8, duration = 30) {
    const uuid = uuidv4();

    const states = {
        [user_id]: {
            words: [],
            stage: 'not-started',
            score: 0
        },
        [rival_id]: {
            words: [],
            stage: 'not-started',
            score: 0
        },
    };

    const letters = util.generateLetters(8);

    const game = {
        uuid: uuid,
        states: states,
        config: {
            letters: letters,
            duration: duration
        }
    }
}

const example_game = {
    uuid: 'fwu0e8gtabofubeg8g',
    states: {
        user_id_1: {
            words: ['dog, cat, mouse'],
            stage: 'finished',
            score: 200,
        },
        user_id_2: {
            words: ['mouse'],
            stage: 'finished',
            score: 70,
        },
    },
    config: {
        letters: ['DOGCATMOUSE'],
        duration: 30,
    }
};

function createGame(game) {
    collection.insert(game);
}

function updateGame(uuid, user_id, state) {
    collection.updateOne(
        { uuid: uuid },
        { $set: { ['states.' + user_id]: state } }
    );
}

function getGame(uuid) {
    return collection.findOne(
        { uuid: uuid }
    );
}




