import mongoose from 'mongoose'
import chalk from 'chalk'
mongoose.set('strictQuery', false)

export const connectMongoose = async (serverAddress, database) => {
    console.log(`Mongoose is connecting to ${serverAddress}`)
    await mongoose.connect((serverAddress + database), { useNewUrlParser: true })
        .catch((error) => {
            console.log(error)
            console.log(chalk.red(`Mongoose failed to connect to ${serverAddress}.`));
        });
    await checkState()
    checkDatabase(serverAddress, database)
}

export const checkState = async () => {
    const mongooseState = mongoose.STATES[mongoose.connection.readyState];
    return new Promise((resolve) => {
        if (mongooseState === 'connected') {
            console.log(chalk.green(`Mongoose is ${mongooseState}.`));
            resolve();
        } else if (mongooseState === 'connecting') {
            console.log(`Mongoose is ${mongooseState}.`);
            setTimeout(() => {
                checkState().then(resolve);
            }, 1000);
        } else {
            console.log(chalk.red(`Mongoose is ${mongooseState}.`));
        }
    });
}

export const checkDatabase = (serverAddress, dbName) => {
    const Admin = mongoose.mongo.Admin;
    const connection = mongoose.createConnection(serverAddress)
    connection.on('open', () => {
        new Admin(connection.db).listDatabases((err, results) => {
            const databaseList = results.databases
            if (databaseList.some(database => database.name === dbName)) {
                console.log(chalk.green(`Successfully connected to "${dbName}" database.`))
            } else if (typeof (dbName) === 'undefined' || dbName.split(" ").join("") === '') {
                console.log(chalk.red('No database specified.'))
            } else {
                console.log(chalk.yellow(`"${dbName}" database not found, it will be created on use.`))
            }
        });
    });
}