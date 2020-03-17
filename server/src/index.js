const Database = require('./Database');
const Server = require('./Server');

const database = new Database();
const server = new Server();

database.connectToDatabase().then(error => {
    server.init(database);
});