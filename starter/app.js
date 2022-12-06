const express = require('express')
const info = require(`./package.json`)
const dbConnect = require(__dirname + '/dbconnect')

dbConnect.connectMongoose()

const app = express()
const port = 3000
const consoleColor = { green: '\x1b[42m%s\x1b[0m', yellow: '\x1b[43m%s\x1b[0m', red: '\x1b[41m%s\x1b[0m' };

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(consoleColor.green, `${info.name} app listening on port ${port}!`))