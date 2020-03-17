require('dotenv').config();

const mongodb = require('mongodb');
const assert = require('assert');

const MongoClient = mongodb.MongoClient;
const connection_string = process.env.DB_URI;

let anagram_collection;
const cluster = new MongoClient(connection_string, {
    useNewUrlParser: true
});

async function connectToDatabase() {
    return cluster.connect(err => {
        assert.equal(null, err);
        console.log("Connected successfully to cluster!");

        anagram_collection = cluster.db("anagram-game").collection("games");
    })
}

async function createAnagramGame(game_object) {
    return anagram_collection.insertOne(game_object);
}

async function updateAnagramGame(uuid, user_id, updated_state) {
    return anagram_collection.findOneAndUpdate(
        { uuid: uuid },
        { $set: { ['states.' + user_id]: updated_state } }
    );
}

module.exports = function() {
    this.connectToDatabase = connectToDatabase;
    this.createAnagramGame = createAnagramGame;
    this.updateAnagramGame = updateAnagramGame;
};