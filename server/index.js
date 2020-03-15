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

const client = new MongoClient(connection_string, { useNewUrlParser: true });

client.connect(err => {
    assert.equal(null, err);
    console.log("Connected successfully to cluster!");

    const collection = client.db("anagram-game").collection("games");

    collection.insertOne({
        test: "this is a test"
    }).then(err => {
        client.close();
    });
});

// io.on('connection', socket => {
//     console.log('A socket connected!');
// });

// server.listen(port, _ => console.log("Listening on port ", port));

