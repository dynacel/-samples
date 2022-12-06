import mongoose from 'mongoose'
import * as consoleColor from './consoleColors.js'

const dbName = ""
const mongoServer = `mongodb://127.0.0.1/${dbName}`;

export const connectMongoose = async () => {
    await mongoose.connect(mongoServer, { useNewUrlParser: true })
        .catch((error) => {
            console.log(consoleColor.red, "Mongoose failed to connect.");
            console.log(error.reason.error.cause)
        });
    await checkState()
    checkDatabase(dbName)
}

export const checkState = async () => {
    const mongooseState = mongoose.STATES[mongoose.connection.readyState];
    return new Promise((resolve) => {
        if (mongooseState === 'connected') {
            console.log(consoleColor.green, `Mongoose is ${mongooseState}.`);
            resolve();
        } else if (mongooseState === 'connecting') {
            console.log(`Mongoose is ${mongooseState}.`);
            setTimeout(() => {
                checkState().then(resolve);
            }, 1000);
        } else {
            console.log(consoleColor.red, `Mongoose is ${mongooseState}.`);
        }
    });
}

export const checkDatabase = (requestedDb) => {
    const Admin = mongoose.mongo.Admin;
    const connection = mongoose.createConnection(mongoServer)
    connection.on('open', () => {
        new Admin(connection.db).listDatabases((err, results) => {
            const databaseList = results.databases
            if (databaseList.some(database => database.name === requestedDb)) {
                console.log(consoleColor.green, `Successfully connected to "${requestedDb}" database.`)
            } else if (requestedDb.split(" ").join("") === '' || requestedDb === null || typeof (requestedDb) === 'undefined') {
                console.log(consoleColor.red, 'No database specified.')
            } else {
                console.log(consoleColor.yellow, `"${requestedDb}" database not found, it will be created on use.`)
            }
        });
    });
}