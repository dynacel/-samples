import mongoose from 'mongoose'
import * as consoleColor from './consoleColors.js'
mongoose.set('strictQuery', false)

export const connectMongoose = async (serverAddress, database) => {
    console.log(`Mongoose is connecting to ${serverAddress}`)
    await mongoose.connect((serverAddress + database), { useNewUrlParser: true })
        .catch((error) => {
            console.log(error)
            console.log(consoleColor.red, `Mongoose failed to connect to ${serverAddress}.`);
        });
    await checkState()
    checkDatabase(serverAddress, database)
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

export const checkDatabase = (serverAddress, database) => {
    const Admin = mongoose.mongo.Admin;
    const connection = mongoose.createConnection(serverAddress)
    connection.on('open', () => {
        new Admin(connection.db).listDatabases((err, results) => {
            const databaseList = results.databases
            if (databaseList.some(database => database.name === database)) {
                console.log(consoleColor.green, `Successfully connected to "${database}" database.`)
            } else if (typeof (database) === 'undefined' || database.split(" ").join("") === '') {
                console.log(consoleColor.red, 'No database specified.')
            } else {
                console.log(consoleColor.yellow, `"${database}" database not found, it will be created on use.`)
            }
        });
    });
}