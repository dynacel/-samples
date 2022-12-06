import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'
import * as dbConnect from './dbconnect.js'
import * as consoleColor from './consoleColors.js'

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

dbConnect.connectMongoose();

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => {
    console.log(consoleColor.BGgreen, `App listening on port ${port}!`)
})