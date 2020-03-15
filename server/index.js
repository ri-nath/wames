require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongodb = require('mongodb');
const assert = require('assert');

const MongoClient = mongodb.MongoClient;

const connection_string = process.env.DB_URI;
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const cluster = new MongoClient(connection_string, { useNewUrlParser: true });

let collection;

cluster.connect(err => {
    assert.equal(null, err);
    console.log("Connected successfully to cluster!");

    collection = cluster.db("anagram-game").collection("games");

    initServer();
});

function initServer() {
    io.on('connection', socket => {
        console.log('A socket connected!');
    });

    server.listen(port, _ => console.log("Listening on port ", port));
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

function updateGame(uuid, user_id, game_obj) {
    collection.updateOne(
        { uuid: uuid },
        { $set: { ['states.' + user_id]: game_obj.state } }
    );
}

function getGame(uuid) {
    return collection.findOne(
        { uuid: uuid }
    );
}






