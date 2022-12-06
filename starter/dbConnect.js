const mongoose = require('mongoose');
const Admin = mongoose.mongo.Admin;
const dbName = "test"
const mongoServer = `mongodb://127.0.0.1/${dbName}`;
const consoleColor = { green: '\x1b[42m%s\x1b[0m', yellow: '\x1b[43m%s\x1b[0m', red: '\x1b[41m%s\x1b[0m' };

exports.connectMongoose = async () => {
    await mongoose.connect(mongoServer, { useNewUrlParser: true })
        .catch((error) => {
            console.log(consoleColor.red, "Mongoose failed to connect.");
            console.log(error.reason.error.cause)
        });
    await this.checkState()
    this.checkDatabase(dbName)
}

exports.checkState = async () => {
    const mongooseState = mongoose.STATES[mongoose.connection.readyState];
    return new Promise((resolve) => {
        if (mongooseState === 'connected') {
            console.log(consoleColor.green, `Mongoose is ${mongooseState}.`);
            resolve();
        } else if (mongooseState === 'connecting') {
            console.log(`Mongoose is ${mongooseState}.`);
            setTimeout(() => {
                this.checkState().then(resolve);
            }, 1000);
        } else {
            console.log(consoleColor.red, `Mongoose is ${mongooseState}.`);
        }
    });
}

exports.checkDatabase = (requestedDb) => {
    connection = mongoose.createConnection(mongoServer)
    connection.on('open', () => {
        new Admin(connection.db).listDatabases((err, databaseList) => {
            if (databaseList.databases.some(database => database.name === requestedDb)) {
                console.log(consoleColor.green, `Successfully connected to ${requestedDb} database.`)
            } else {
                    console.log(consoleColor.yellow, `${requestedDb} database not found, it will be created on use.`)
                }
        });
    });
}
