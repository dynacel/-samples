import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import chalk from 'chalk'
import * as dbConnect from './dbconnect.js';
dotenv.config();

const app = express();
const port = 3000;
const mongoServer = 'mongodb://127.0.0.1/';
const dbName = 'this';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

dbConnect.connectMongoose(mongoServer, dbName);

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => { console.log(chalk.bgGreen(`App listening on port ${port}.`)) })